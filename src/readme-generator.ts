// Import the necessary modules from Node.js
import fs from 'fs';
import path from 'path';

// Define the directory containing the markdown files and the output files
const promptsDir = path.join(__dirname, '..', 'prompts');
const promptOutputFile = path.join(__dirname, '..', 'prompt.md');
const readmeFile = path.join(__dirname, '..', 'README.md');

// Function to recursively find markdown files in a directory
async function findMarkdownFiles(dir: string, files: string[] = []): Promise<string[]> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            await findMarkdownFiles(res, files);
        } else if (res.endsWith('.md')) {
            files.push(res);
        }
    }
    return files;
}

// Function to read and combine the content of markdown files
async function combineMarkdown(files: string[]): Promise<string> {
    let combinedContent = '';
    for (const file of files) {
        const content = await fs.promises.readFile(file, 'utf8');
        combinedContent += content + '\n\n';
    }
    return combinedContent;
}

// Main function to orchestrate the combination and update the README
async function generateCombinedReadme() {
    try {
        console.log('Finding markdown files...');
        const markdownFiles = await findMarkdownFiles(promptsDir);
        console.log(`Found ${markdownFiles.length} markdown files.`);
        
        console.log('Combining markdown content...');
        const combinedContent = await combineMarkdown(markdownFiles);
        
        console.log('Writing combined content to prompt.md...');
        await fs.promises.writeFile(promptOutputFile, combinedContent);
        console.log('Successfully combined markdown into prompt.md');
        
        // Update README.md with information about prompt.md
        const readmeContent = `# Combined Markdown Prompts\n\nThis project includes a combined markdown file of prompts named [prompt.md](./prompt.md), which aggregates all markdown content from the 'prompts' directory into a single file. This file serves as a comprehensive collection of generative AI prompts.`;
        console.log('Updating README.md with prompt.md details...');
        await fs.promises.writeFile(readmeFile, readmeContent);
        console.log('Successfully updated README.md');
    } catch (error) {
        console.error('Error during markdown combination:', error);
    }
}

// Execute the main function
generateCombinedReadme();
