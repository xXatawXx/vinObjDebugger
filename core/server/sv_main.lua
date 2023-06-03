RegisterServerEvent('saveObjectDataToFile')
AddEventHandler('saveObjectDataToFile', function(objectData)
    local fileToCreate = io.open('resources//vinObjDebugger//saved_object_data.txt', "a")
    local fileOutput = saveObjData(objectData)
    io.output(fileToCreate)
    io.write(fileOutput)
    io.close(fileToCreate)
end)

saveObjData = function(objectData)
    local saveToFileDataText = ""
    
    for i = 1, #objectData do
        local newDataInserted = {}

        for _, val in pairs(objectData[i]) do
            newDataInserted[#newDataInserted + 1] = val
        end

        saveToFileDataText = "Date Created: ".. os.date("!%Y-%m-%dT%H:%M:%SZ\n") .. json.encode(newDataInserted) .. "\n\n"
    end

    return saveToFileDataText
end