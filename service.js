/**
* dmax address book service
*
* @monthrie
*/

// Initialize MDS
MDS.init(function(msg) {
    
    // Check if the received message is a MAXIMA message
    if (msg.event == "MAXIMA") {
        //if it is then log it
        MDS.log('Received MAXIMA message: ' + JSON.stringify(msg));
        // Check if the application is the one we're interested in
        if (msg.data.application == "dmaxabclient") {
            // Log the received data
            MDS.log('Received xdata: ' + msg.data.data);
            // Convert the data from hex to string
            MDS.cmd(`convert from:HEX to:String data:${msg.data.data}`, function(resp) {
                // Parse the string as JSON
                const jsonData = JSON.parse(resp.response.conversion);
                // Log the parsed JSON data
                MDS.log('Received JSON data: ' + JSON.stringify(jsonData));

            // Check if the message is a "TABLE_DATA" message
            if (jsonData.type == "TABLE_DATA") {
                // Extract the 'entries' from the JSON data
                const entries = jsonData.data; // Array of entries
                // Log the entries
                MDS.log('Received entries: ' + JSON.stringify(entries));
                // Update the AddressBook table with the received entries
                updateTable(entries);
                }
            });
        }
    }
});

// Function to update the table with new data
function updateTable(entries) {
    let tableHTML = '';
    for (let i = 0; i < entries.length; i++) {
        tableHTML += `<tr><td>${entries[i].name}</td><td>${entries[i].max}</td></tr>`;
    }
    document.querySelector('#address-book tbody').innerHTML = tableHTML;
}

/**
 * Sends a Maxima message with the provided data
 * @param {object} message The message data
 * @param {string} address The MAX# address to send the message to
 * @param {function} callback A callback function to run after the message is sent
 */
function sendMessage(message, address, callback) {
    // Construct the Maxima command string
    var maxcmd = "maxima action:send poll:true to:" + address + " application:dmaxab data:" + JSON.stringify(message);

    // Send the Maxima command
    MDS.cmd(maxcmd, function(msg) {
        MDS.log('Sent message: ' + JSON.stringify(msg));

        // Call the callback function, if one was provided
        if (callback) {
            callback(msg);
        }
    });
}
