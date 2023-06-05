RegisterNetEvent('saveObjectDataToFile');
on('saveObjectDataToFile', (objectData) => {
    let fileToCreate = fs.openSync(`${GetResourcePath(GetCurrentResourceName())}/saved_object_data.txt`, 'a');
    let fileOutput = saveObjData(objectData);
    fs.writeFileSync(fileToCreate, fileOutput);
    fs.closeSync(fileToCreate);
});

const saveObjData = (objectData) => {
    let saveToFileDataText = "";
    let newObjectDataInserted = {};
    
    let newTable = newArrayLoop(objectData);
    newObjectDataInserted = Array.from(newTable);
    
    saveToFileDataText = `Date Created: ${new Date().toISOString()}\nValues saved: ${JSON.stringify(newObjectDataInserted)} (Usage: [xPos, yPos, zPos, xRot, yRot, zRot])\n\n`;
    return saveToFileDataText;
}

const newArrayLoop = (tbl) => {
    let newTableInserted = [];
    for (let i = 0; i < tbl.length; i++) {
        newTableInserted.push(tbl[i]);
    }
    return newTableInserted;
}
