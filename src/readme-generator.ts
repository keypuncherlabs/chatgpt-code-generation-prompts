import fs from 'fs';
import path from 'path';

const promptsDir = path.join(__dirname, '..', 'prompts');
const outputFile = path.join(__dirname, '..', 'README.md');

// Function to recursively find markdown files
async function findMarkdownFiles(dir: string, files: string[] = []) {
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

// Function to read and combine markdown content
async function combineMarkdown(files: string[]) {
    let combinedContent = '';
    for (const file of files) {
        const content = await fs.promises.readFile(file, 'utf8');
        combinedContent += content + '\n\n';
    }
    return combinedContent;
}

// Main function to orchestrate the combination
async function generateCombinedReadme() {
    try {
        console.log('Finding markdown files...');
        const markdownFiles = await findMarkdownFiles(promptsDir);
        console.log(`Found ${markdownFiles.length} markdown files.`);
        
        console.log('Combining markdown content...');
        const combinedContent = await combineMarkdown(markdownFiles);
        
        console.log('Writing combined content to README.md...');
        await fs.promises.writeFile(outputFile, combinedContent);
        console.log('Successfully combined markdown into README.md');
    } catch (error) {
        console.error('Error during markdown combination:', error);
    }
}

generateCombinedReadme();
