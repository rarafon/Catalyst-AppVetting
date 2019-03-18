// ***  HANDLE-IT FORM - Using Node pdfmake Module - MIT License.
// ***  BELOW CODE BY ROHIN ADALJA (github.com/rohinadalja), USING SERVER-SIDE PDF TOOL (pdfmake).
// ***     Use Dependant on the following: (1) cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.39/pdfmake.min.js
// ***                                     (2) cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.39/vfs_fonts.js
// ***     TESTED WORKING IN: Safari 12.0, Chrome 70.0.3538.102

function exportHandletoPDF() {
     pdfMake.createPdf(handleDefinition).open();
}

var handleDefinition = {  content: [           // BEGIN PRINT LAYOUT! ***********
{ text: 'CATALYST PARTNERSHIPS                                                        HANDLE-IT REPORT', style: 'h2b' },

{ text: [ "\n\n\nRECIPIENT NAME: ", {text: dataPAF.fullName, style:'inText' } ], style:'eachLine'},

{ text: [ "RECP. ADDRESS:   ", {text: dataPAF.addr1, style:'inText' }], style:'eachLine'},
{text: dataPAF.addr2, margin:[101,0,0,0], style:'inText'},   //margin:58
{text: dataPAF.addr3, margin:[101,0,0,0], style:'inText' },

{ text: [ "BIO/Project Summary: ", {text: dataPAF.summ, style:'inText' } ], style:'eachLine'},  // <new text field to be added>

"WORK ITEMS / MATERIALS OVERVIEWS / COST ESTIMATES:",           //WORK ITEM AND COST
    { text: [ {text: workItems, style:'inText' } ], style:'eachWorkItem'},
    { text: [ "Materials: ", {text: dataPAF.materials, style:'inText' } ], style:'eachLine'},
    // { text: [ "Volunteers Needed: ", {text: dataPAF.volunteers, style:'inText' } ], style:'eachLine'},
    

// "HAZARD / SAFETY TESTING:",
//     { ul: [
//             { text: [ "LEAD?: ", {text: dataPAF.hasLead, style:'inText' } ], style:'eachBullet'},         //yes or no
//             { text: [ "ASBESTOS?: ", {text: dataPAF.hasAsbestos, style:'inText' } ], style:'eachBullet'},     //yes or no
//             { text: [ "   If Yes on either, plan & cost estimate: ", {text: dataPAF.safety, style:'inText' } ], style:'eachBullet'}
//           ],
//       style: 'list'
//     },

// "\nPARTNERS: ",                   //<name, in-kind materials description>
//     { text: [ {text: partnerItems, style:'inText' } ], style:'eachWorkItem'},

// { text: [ "SUBCONTRACTOR(S): ", {text: dataPAF.subcontractors, style:'inText' }], style:'eachLine'},

"OTHER COSTS:",
    { ul: [
            { text: [ "TOOL RENTALS: ", {text: dataPAF.toolrentals, style:'inText' } ], style:'eachBullet'},      //<y/n, description & cost if “yes”>
            { text: [ "PERMIT Needed: ", {text:  dataPAF.permitAggregated, style:'inText' } ], style:'eachBullet'},     //<y/n, description & cost if “yes”>
            { text: [ "PORTAPOTTIE: ", {text: dataPAF.portaAggregated, style:'inText' } ], style:'eachBullet'},       //<y/n, description & cost if “yes”>
            { text: [ "WASTE: ", {text: dataPAF.dumpsterAggregated, style:'inText' } ], style:'eachBullet'}              //<y/n, description & cost if “yes”>
          ],
      style: 'list'
    },

{ text: [ "\nTOTAL COST ESTIMATE:   $", {text: dataPAF.estimates, style:'inText' } ], style:'eachLine'},   //<sum of cost fields> 

// { text: [ "VOLUNTEERS NEEDED: ", {text: dataPAF.volunteers, style:'inText' } ], style:'eachLine'},      //< # >

{ text: [ "PROPOSED DATES: ", {text: dataPAF.dateAggregated, style:'inText' } ], style:'eachLine'},         //<start date, end date>

{ text: [ "NOTES: ", {text: '', style:'inText' } ], style:'eachLine'},                    //<text field>


{ text: '\n\n*****', style: 'center' }
], //END CONTENT ***************************************************
defaultStyle: { //START STYLES
        fontSize: 12,
        bold: true,
        underline: true
                                    // decorationStyle: 'dashed' decorationType: 'underline'
    },
styles: {      
    eachLine: { 
        margin:[0,0,0,8]
        },
    inText: { 
            decorationStyle: 'dashed',
            decoration: 'underline',
            bold: false,
        },
    question: { 
            fontSize: 12,
            bold: true,
            underline: true
                                    // decorationStyle: 'dashed' decorationType: 'underline'
    },
    h2b: {
        fontSize: 15,
        // bold: true,
        alignment: 'center'

    },
    eachBullet: {
    },
    b: {
        fontSize: 12,
        // bold: true
    },
    center: {
        fontSize: 14,
        alignment: 'center'
    },
    left: {
        fontSize: 14,
        // bold: true,
        alignment: 'left'
    },
    right: {
        fontSize: 14,
        // bold: true,
        alignment: 'right'
    },
    list: {
        // bold: false,
        margin: [12, 0, 0, 0],
    }
}, //END STYLES

pageSize: 'LETTER',
info: {
    title: 'PAF Form Catalyst',
    author: 'Catalyst',
    subject: 'Project Assessment Form',
    keywords: 'PAF Catalyst Corvus',
      }
// pageMargins: [ 40, 60, 40, 60 ],
};        // END PRINT LAYOUT