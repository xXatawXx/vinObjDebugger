const ObjectData = {
    currentTickThread : 0,
    objectTickThread : 0,
    objectToDebug : Config.ObjectName,
    DebugMode: { text: "Debug Mode", value: false, sX : 0.70, sY : 0.30},
    ObjectId:  {text: "Object ID", value: 0, sX : 0.70, sY: 0.325},
    ObjectHash : {text: "Object Hash", value: 0, sX : 0.70, sY: 0.35},
    inActiveMovementState: {text: "Active Movement State", value: false, sX : 0.70, sY: 0.375},
    CurrentMovementType: {text: "Current Movement Type", value: "", sX : 0.70, sY: 0.4},
    CurrentMovementTypeValue: {text: "Current Movement Type Value", value: "", sX : 0.70, sY: 0.425},
    CurrentMovementIndex: {text: "Current Movement Index", value: 0, sX : 0.70, sY: 0.45},
    CurrentMovementData: [
        {
            xPos: 0,
            yPos: 0,
            zPos: 0,
            xRot: 0,
            yRot: 0,
            zRot: 0,
        },
    ],
    storedMovementPositionVal1: { text: "xPos Value", storedVal: 0, sX : 0.15, sY : 0.30},
    storedMovementPositionVal2: { text: "yPos Value", storedVal: 0, sX : 0.15, sY : 0.325},
    storedMovementPositionVal3: { text: "zPos Value", storedVal: 0, sX : 0.15, sY : 0.35},
    storedMovementRotationVal1: { text: "xRot Value", storedVal: 0, sX : 0.15, sY : 0.30},
    storedMovementRotationVal2: { text: "yRot Value", storedVal: 0, sX : 0.15, sY : 0.325},
    storedMovementRotationVal3: { text: "zRot Value", storedVal: 0, sX : 0.15, sY : 0.35},
    playerPed : () => {
        return PlayerPedId();
    },
    AttachDebuggerEntity : (entity, ped, boneIndex, xPos, yPos, zPos, xRot, yRot, zRot) => { // for r_hand: 28422
        AttachEntityToEntity(entity, ped, GetPedBoneIndex(ped, boneIndex), xPos, yPos, zPos, xRot, yRot, zRot, false, true, true, false, 0.0, false);
    },
    spawnObjectForDebugging : (objectName) => {
        ObjectData.ObjectHash.value = GetHashKey(objectName);
        const [pedX, pedY, pedZ] = GetEntityCoords((ObjectData.playerPed()));
        const [fX, fY, fZ] = GetEntityForwardVector(ObjectData.playerPed());
        RequestModel(ObjectData.ObjectHash.value);
        if(!HasModelLoaded(ObjectData.ObjectHash.value)) return;
        ObjectData.ObjectId.value = CreateObject(ObjectData.ObjectHash.value, pedX + fX, pedY + fY, pedZ + fZ + 0.5, true, true, true);
    },
    drawTxt : (x, y, text) => {
        SetTextFont(4);
        SetTextScale(0.4, 0.4);
        SetTextColour(255, 0, 0, 255);
        SetTextDropShadow(0, 0, 0, 0, 15);
        SetTextEdge(2, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextCentre(1);
        BeginTextCommandDisplayText("STRING");
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandDisplayText(x, y);
    },
};

const startObjectDebugThread = () => {
    if (ObjectData.DebugMode.value) {
        ObjectData.objectTickThread = setTick(() => {
            const objectValues = Object.values(ObjectData);
            const objectDataKeys = Object.keys(ObjectData);
            // Draw all the necessary data.
            objectDataKeys.forEach(objectDataKey => {
                const objectDataElement = ObjectData[objectDataKey];
                if (objectDataElement.value !== undefined) {
                    ObjectData.drawTxt(objectDataElement.sX, objectDataElement.sY, `~w~${objectDataElement.text}: ~s~${objectDataElement.value}`);
                }
            });
            
            if (IsControlJustReleased(0, 174) && !ObjectData.inActiveMovementState.value && ObjectData.CurrentMovementType.value !== "pos") {
                ObjectData.CurrentMovementType.value = "pos";
                movementPosition();
            } else if (IsControlJustReleased(0, 175) && !ObjectData.inActiveMovementState.value && ObjectData.CurrentMovementType.value !== "rot") {
                ObjectData.CurrentMovementType.value = "rot";
                movementRotation();
            } else if (IsControlJustReleased(0, 176) && ObjectData.CurrentMovementTypeValue.value) {
                ObjectData.inActiveMovementState.value = !ObjectData.inActiveMovementState.value;
            }
            
            // Display the values being edited.
            const values = ObjectData.CurrentMovementType.value ? (ObjectData.CurrentMovementType.value === "pos" ? objectValues.slice(11, 14) : objectValues.slice(14, 17)) : [];
            
            values.forEach(positionDisplay => {
                ObjectData.drawTxt(positionDisplay.sX, positionDisplay.sY, `~w~${positionDisplay.text}: ~s~${positionDisplay.storedVal}`);
            });
            
            ObjectData.AttachDebuggerEntity(ObjectData.ObjectId.value, ObjectData.playerPed(), Config.PedBoneIndex, ObjectData.storedMovementPositionVal1.storedVal, ObjectData.storedMovementPositionVal2.storedVal, ObjectData.storedMovementPositionVal3.storedVal, ObjectData.storedMovementRotationVal1.storedVal, ObjectData.storedMovementRotationVal2.storedVal, ObjectData.storedMovementRotationVal3.storedVal);
        });
    }
};

const movementPosition = () => {
    if (ObjectData.CurrentMovementType.value === "pos") {
        let i = 0;
        ObjectData.CurrentMovementTypeValue.value = "";
        ObjectData.CurrentMovementIndex.value = 0;
        clearTick(ObjectData.currentTickThread);
        ObjectData.currentTickThread = 0;
        ObjectData.currentTickThread = setTick(() => {
            if (i <= 2) {
                const key = Object.keys(ObjectData.CurrentMovementData[0])[i];
                if (IsControlJustReleased(0, 172) && !ObjectData.inActiveMovementState.value) {
                    ObjectData.CurrentMovementIndex.value = i;
                    i++;
                    ObjectData.CurrentMovementTypeValue.value = key;
                } else if (IsControlJustReleased(0, 174) && ObjectData.CurrentMovementTypeValue.value !== "" && ObjectData.inActiveMovementState.value) {
                    switch (ObjectData.CurrentMovementTypeValue.value) {
                        case "xPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 0.1;
                            ObjectData.storedMovementPositionVal1.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                        case "yPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 0.1;
                            ObjectData.storedMovementPositionVal2.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                        case "zPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 0.1;
                            ObjectData.storedMovementPositionVal3.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                    }
                } else if (IsControlJustReleased(0, 175) && ObjectData.CurrentMovementTypeValue.value !== "" && ObjectData.inActiveMovementState.value) {
                    switch (ObjectData.CurrentMovementTypeValue.value) {
                        case "xPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 0.1;
                            ObjectData.storedMovementPositionVal1.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                        case "yPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 0.1;
                            ObjectData.storedMovementPositionVal2.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                        case "zPos":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 0.1;
                            ObjectData.storedMovementPositionVal3.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value].toFixed(1));
                        break;
                    }
                }
            } else {
                i = 0;
            }
        });
    }
};

const movementRotation = () => {
    if (ObjectData.CurrentMovementType.value === "rot") {
        let i = 3;
        ObjectData.CurrentMovementTypeValue.value = "";
        ObjectData.CurrentMovementIndex.value = 0;
        clearTick(ObjectData.currentTickThread);
        ObjectData.currentTickThread = 0;
        ObjectData.currentTickThread = setTick(() => {
            if (i <= 5) {
                const key = Object.keys(ObjectData.CurrentMovementData[0])[i];
                if (IsControlJustReleased(0, 172) && !ObjectData.inActiveMovementState.value) {
                    ObjectData.CurrentMovementIndex.value = i;
                    i++;
                    ObjectData.CurrentMovementTypeValue.value = key;
                } else if (IsControlPressed(0, 174) && ObjectData.CurrentMovementTypeValue.value !== "" && ObjectData.inActiveMovementState.value) {
                    switch (ObjectData.CurrentMovementTypeValue.value) {
                        case "xRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 1.0;
                            ObjectData.storedMovementRotationVal1.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                        case "yRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 1.0;
                            ObjectData.storedMovementRotationVal2.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                        case "zRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] -= 1.0;
                            ObjectData.storedMovementRotationVal3.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                    }
                } else if (IsControlPressed(0, 175) && ObjectData.CurrentMovementTypeValue.value !== "" && ObjectData.inActiveMovementState.value) {
                    switch (ObjectData.CurrentMovementTypeValue.value) {
                        case "xRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 1.0;
                            ObjectData.storedMovementRotationVal1.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                        case "yRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 1.0;
                            ObjectData.storedMovementRotationVal2.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                        case "zRot":
                            ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value] += 1.0;
                            ObjectData.storedMovementRotationVal3.storedVal = Number(ObjectData.CurrentMovementData[0][ObjectData.CurrentMovementTypeValue.value]);
                        break;
                    }
                }
            } else {
                i = 3;
            }
        });
    }
};

const resetValueStates = () => {
    ObjectData.CurrentMovementType.value = "";
    ObjectData.CurrentMovementTypeValue.value = "";
    ObjectData.CurrentMovementIndex.value = 0;
    clearTick(ObjectData.currentTickThread);
    clearTick(ObjectData.objectTickThread);
    ObjectData.currentTickThread = 0;
    ObjectData.objectTickThread = 0;
    ObjectData.CurrentMovementData[0]["xPos"] = 0;
    ObjectData.CurrentMovementData[0]["yPos"] = 0;
    ObjectData.CurrentMovementData[0]["zPos"] = 0;
    ObjectData.CurrentMovementData[0]["xRot"] = 0;
    ObjectData.CurrentMovementData[0]["yRot"] = 0;
    ObjectData.CurrentMovementData[0]["zRot"] = 0;
    ObjectData.storedMovementPositionVal1.storedVal = 0;
    ObjectData.storedMovementPositionVal2.storedVal = 0;
    ObjectData.storedMovementPositionVal3.storedVal = 0;
    ObjectData.storedMovementRotationVal1.storedVal = 0;
    ObjectData.storedMovementRotationVal2.storedVal = 0;
    ObjectData.storedMovementRotationVal3.storedVal = 0;
};

const clearObjects = () => {
    const [pedX, pedY, pedZ] = GetEntityCoords((ObjectData.playerPed()));
    const debugObject = GetClosestObjectOfType(pedX, pedY, pedZ, 1000.0, GetHashKey(ObjectData.objectToDebug), false, false);
    for (const [k, v] of Object.entries(GetGamePool('CObject'))) {
        if (IsEntityAttachedToEntity(ObjectData.playerPed(), v) || DoesEntityExist(debugObject)) {
            SetEntityAsMissionEntity(v, true, true);
            DeleteObject(v);
            DeleteEntity(v);
            ClearPedTasksImmediately(ObjectData.playerPed());
        }
    }
};

const saveObjectDataTxtFile = () => {
    let values = [];
    const sortedData = ObjectData.CurrentMovementData.sort((a, b) => a.xPos - b.xPos);
    
    sortedData.forEach(value => {
        values = [value.xPos, value.yPos, value.zPos, value.xRot, value.yRot, value.zRot]
    });
    
    console.log(`Values saved to a text document where the resource is downloaded: ${values}`);
    emitNet('saveObjectDataToFile', values);
};

RegisterCommand('debugentity', (source,args,user) => {
    ObjectData.DebugMode.value = !ObjectData.DebugMode.value;
    if (DoesEntityExist(ObjectData.ObjectId.value) && !ObjectData.DebugMode.value) {
        console.log("Object Deleted");
        saveObjectDataTxtFile();
        resetValueStates();
        clearObjects();
    } else {
        startObjectDebugThread();
        ObjectData.spawnObjectForDebugging(ObjectData.objectToDebug);
    }
});

addEventListener("onClientResourceStart", (resourceName) => {
    if(GetCurrentResourceName() != resourceName) { return; }
    clearObjects();
    console.log(`${resourceName} has been started and is deleting objects.`);
});
