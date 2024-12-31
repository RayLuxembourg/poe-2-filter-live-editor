import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { FilterItem } from '@/app/interfaces';

type ResponseData = {
  success: boolean;
  editableSection?: string;
  error?: string;
};

const PATH_TO_FILTER_FILE = ""

const latestFilter = "https://github.com/NeverSinkDev/NeverSink-PoE2litefilter/releases/latest"
export async function GET(req: NextRequest) {
  try {
    const filePath = PATH_TO_FILTER_FILE;

    // Read the file synchronously
    let fileContent = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf-8')
      : '';

    // Define markers
    const startMarker = '####### EDITOR SECTION #######';
    const endMarker = '####### EDITOR SECTION END #######';

    let startIndex = fileContent.indexOf(startMarker);
    let endIndex = fileContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      // Preserve content before and after the editor section
      const beforeSection = startIndex === -1 ? fileContent : fileContent.substring(0, startIndex).trim();
      const afterSection = endIndex === -1 ? '' : fileContent.substring(endIndex + endMarker.length).trim();

      // Create the placeholder editor section
      const placeholder = `
${startMarker}

Show
Rarity Normal
BaseType ""
ItemLevel >= 1
SetFontSize 32
SetTextColor 255 255 255 255
SetBorderColor 255 255 255 255
SetBackgroundColor 0 0 0 255
PlayAlertSound 1 300
PlayEffect White
MinimapIcon 1 White Star
Quality >= 0

${endMarker}
      `.trim();

      // Construct the new file content
      fileContent = `${beforeSection}\n\n${placeholder}\n\n${afterSection}`.trim();

      // Write back the updated content
      fs.writeFileSync(filePath, fileContent, 'utf-8');

      // Update indices after modification
      startIndex = fileContent.indexOf(startMarker);
      endIndex = fileContent.indexOf(endMarker);
    }
    // Extract the section between the markers
    const editableSection = fileContent
      .substring(startIndex + startMarker.length, endIndex)
      .trim();
    const normalizedSection = editableSection.replace(/\r\n/g, '\n');

    // const lines = normalizedSection.split('\n').filter(line => !line.trim().startsWith('#'));

    // Join the cleaned lines back into a string
    // const cleanedSection = lines.join('\n');
    // Split into blocks by empty lines
    const filterBlocks = normalizedSection.split('\n\n').map(block => block.trim());
    // const filterBlocks = cleanedSection.split('\n\n').map(block => block.trim());

    // Parse each block into key-value pairs
    const parsedFilters = filterBlocks.map(block => {
      const lines = block.split('\n'); // Split each block into lines
      const filter: any = {}; // Temporary object for filter properties

      lines.forEach(line => {
        const [key, ...valueParts] = line.split(' '); // Split key from value
        const value = valueParts.join(' '); // Recombine the value

        if (key === 'BaseType') {
          // BaseType is special; extract multiple quoted values into an array
          filter[key] = value.match(/"([^"]+)"/g)?.map(v => v.replace(/"/g, '')) || [];
        } else {
          // For other keys, just assign the value
          filter[key] = value;
        }
      });

      return filter; // Return the parsed filter object
    }).filter(filter => {
      // Exclude objects where all keys and values are empty
      return !(Object.keys(filter).length === 1 && filter[""] === "");
    });



    // Send the extracted section in the response
    return NextResponse.json({ success: true, filters: parsedFilters });
  } catch (error: any) {
    // Handle errors (e.g., file not found, parsing issues)
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function POST(req: NextRequest) {
  try {
    const filePath = PATH_TO_FILTER_FILE;

    // Parse the request body as JSON
    const filters: FilterItem[] = await req.json();

    // Convert the filters array back to CSV format
    const formattedCSV = filters.map(filter => {
      const baseTypes = filter.BaseType.map(type => `"${type}"`).join(' ');
      return `Show
Rarity ${filter.Rarity}
BaseType ${baseTypes}
ItemLevel ${filter.ItemLevel}
SetFontSize ${filter.SetFontSize}
SetTextColor ${filter.SetTextColor}
SetBorderColor ${filter.SetBorderColor}
SetBackgroundColor ${filter.SetBackgroundColor}
PlayAlertSound ${filter.PlayAlertSound}
PlayEffect ${filter.PlayEffect}
MinimapIcon ${filter.MinimapIcon}`;
    }).join('\n\n');

    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Define markers
    const startMarker = '####### EDITOR SECTION #######';
    const endMarker = '####### EDITOR SECTION END #######';

    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      const placeholderSection = `
${startMarker}
${formattedCSV}
${endMarker}`.trim();

      const updatedContent = `${placeholderSection}\n\n${fileContent}`;
      fs.writeFileSync(filePath, updatedContent, 'utf-8');

    } else {


      // Replace the editable section
      const beforeSection = fileContent.substring(0, startIndex + startMarker.length).trim();
      const afterSection = fileContent.substring(endIndex).trim();

      const updatedContent = `${beforeSection}\n\n${formattedCSV}\n\n${afterSection}`;
      fs.writeFileSync(filePath, updatedContent, 'utf-8');

    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
