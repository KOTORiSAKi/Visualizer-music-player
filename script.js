

const folder_name = ['edm', 'jazz', 'lofi', 'phonk', 'pop', 'rock'];

let folder_paths;

function createFolderPaths(fileNames, baseDirectory) {
    const folderPaths = fileNames.map((fileName) => {
        return path.join(baseDirectory, fileName);
    });
    return folderPaths;
}

function getPath(floder_number){
    const baseDirectory = './music';
    folder_paths = createFolderPaths(folder_name[floder_number], baseDirectory);
}



