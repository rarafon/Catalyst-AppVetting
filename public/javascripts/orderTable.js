  // SORT TABLE CODE --------------------------------------------------
  function orderTable(inTableClass, colmn) {
    var switchCnt = 0, rows, reverse;

    var curr = "ascending";
    var thisTable = document.getElementsByClassName(inTableClass)[0];
    var switching = true;
    
    var i, x, y;
    while (switching) {
        switching = false;
        rows = thisTable.getElementsByTagName("tr");
        
        for (i = 1; i < (rows.length - 1); i++) {
            reverse = false;
            x = rows[i].getElementsByTagName("td")[colmn];
            y = rows[i + 1].getElementsByTagName("td")[colmn];
            if (curr == "ascending") {
                if ( ((x && x.innerText && x.innerText.toLowerCase()) || "") > ((y && y.innerText && y.innerText.toLowerCase()) || "") ) {
                    reverse = true;
                    break;
                }
            } else if (curr == "descending") {
                if ( ((x && x.innerText && x.innerText.toLowerCase()) || "") < ((y && y.innerText && y.innerText.toLowerCase()) || "") ) {
                    reverse = true;
                    break;
                }
            }
        }

        if (reverse) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCnt++;      
        } else {
            if (switchCnt == 0 && curr == "ascending") {
            curr = "descending";
            switching = true;
            }
        }
    }
}
// -------------------------------------------------- END SORT TABLE CODE 