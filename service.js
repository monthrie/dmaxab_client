/**
* dmax address book service
*
* @monthrie
*/

MDS.init(function(msg) {
    if (msg.event == "MAXIMA" && msg.data.application == "dmaxabclient") {
        let hexData = msg.data.data;
        if (hexData.startsWith("0x")) {
            hexData = hexData.substring(2);
        }
        MDS.cmd(`convert from:HEX to:String data:${hexData}`, function(resp) {
            let jsonString = resp.response.conversion.replace(/'/g, "");
            const jsonData = JSON.parse(jsonString);
            if (jsonData.type == "TABLE_DATA") {
                const entries = jsonData.data;
                updateTable(entries);
            }
        });
    }
});

function updateTable(entries) {
    let tableHTML = '';
    for (let i = 0; i < entries.length; i++) {
        tableHTML += `<tr><td>${entries[i].name}</td><td>${entries[i].max}</td></tr>`;
    }
    document.querySelector('#address-book tbody').innerHTML = tableHTML;
}

function sendMessage(message, address) {
    const maxCmd = `maxima action:send poll:true to:${address} application:dmaxab data:${JSON.stringify(message)}`;
    MDS.cmd(maxCmd, function(response) {
        if (response.status) {
            MDS.log('Message sent successfully');
        } else {
            MDS.log('Error sending message: ' + response.error);
        }
    });
}

function getClientAddress(callback) {
    MDS.cmd('maxima', function(response) {
        if (response.status) {
            callback(response.response.contact);
        } else {
            MDS.log('Error getting client address: ' + response.error);
        }
    });
}

function sendTableRequest() {
    getClientAddress(function(contact) {
        const data = {
            type: 'TABLE_REQUEST',
            data: { contact }
        };
        sendMessage(data, "MAX#0x30819F300D06092A864886F70D010101050003818D00308189028181009BB7465C454425291EBC2A851A4852F8C1B02F7A173A15780B304E2DCA663CC69AF15CA39D21914F5C1C4D20BE1066A29446F1B6AC8BC7FE1AE466D7E672C9BFAB64BA35BEE30ED8217BDB95959EA1B4410C70EF348051642876A8E99138AFCF5933E6DB3DB3ADBB3D418DBFFF30675D8BBB1A534DC5EE03740801579A73A0D10203010001#MxG18HGG6FJ038614Y8CW46US6G20810K0070CD00Z83282G60G1C0ANS2ENGJEFBYJM2SCQFR3U3KBJNP1WS9B0KG1Z2QG5T68S6N2C15B2FD7WHV5VYCKBDW943QZJ9MCZ03ESQ0TDR86PEGUFRSGEJBANN91TY2RVPQTVQSUP26TNR399UE9PPJNS75HJFTM4DG2NZRUDWP06VQHHVQSGT9ZFV0SCZBZDY0A9BK96R7M4Q483GN2T04P30GM5C10608005FHRRH4@78.141.238.36:9001");
    });
}
