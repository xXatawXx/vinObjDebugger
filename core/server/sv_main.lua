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
    local newDataInserted = {}
    
    local newTable = newArrayLoop(objectData)
    newDataInserted = newTable

    saveToFileDataText = "Date Created: ".. os.date("!%Y-%m-%dT%H:%M:%SZ\n") .. "Values saved: " .. json.encode(newDataInserted) .. "\n\n"
    return saveToFileDataText
end

newArrayLoop = function(tbl)
    local newTableInserted = {}
    for i, value in ipairs(tbl) do
        newTableInserted[i] = value
    end
    return newTableInserted
end
