//Module containing functions supporting cryptogames

export function randBitString(length) {
    // Random bitstring of given length
  var text = "";
  var possible = "01";
  for (var i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
  return text;
}

export function sxor(s1, s2) {
	// Function calculating bitwise XOR of two bitstrings input as char-strings
	if(stIsBin(s1) && stIsBin(s2)){
		if(s1.length == s2.length){
			var len = s1.length;
			var xor = parseInt(s1,2) ^ parseInt(s2,2);
			return FormatBitStringLength(xor.toString(2), len);
		}
		else{
			alert("Strings are not equal length.");
		}
	}
	else{
		alert("Inpits have to be bitstrings.");
	}	
}

function FormatBitStringLength(str, length) {
    var r = "" + str;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

export function validInput(x, n){
	if(x.length != n){
		alert("Input length wrong");
		return false;
	}
	if(stIsBin(x) != true){
		alert("Input is not a bitstring");
		return false;
	}
	return true;
}

function stIsBin(str){
	var i = str.length;
	while (i--) {
		if(str.charAt(i) != '0' && str.charAt(i) != '1'){
			return false;
		}
	}
	return true;
}

    /** Builds the row with columns from the specified names. 
     *  If the item parameter is specified, the memebers of the names array will be used as property names of the item; otherwise they will be directly parsed as text.
     */
function buildRowColumns(names, item) {
        var row = '<tr>';
        if (names && names.length > 0)
        {
            $.each(names, function(index, name) {
                var c = item ? item[name+''] : name;
                row += '<td>' + c + '</td>';
            });
        }
        row += '</tr>';
        return row;
    }

export class DynamicTable {
    //Dynamically built table

    /** Builds and sets the headers of the table. */
    _setHeaders() {
        // if no headers specified, we will use the fields as headers.
        this._headers = (this._headers == null || this._headers.length < 1) ? this._fields : this._headers; 
        var h = buildRowColumns(this._headers);
        if (this._table.children('thead').length < 1) this._table.prepend('<thead></thead>');
        this._table.children('thead').html(h);
    }
    
    _setNoItemsInfo() {
        if (this._table.length < 1) return; //not configured.
        var colspan = this._headers != null && this._headers.length > 0 ? 
            'colspan="' + this._headers.length + '"' : '';
        var content = '<tr class="no-items"><td ' + colspan + ' style="text-align:center">' + 
            this._defaultText + '</td></tr>';
        if (this._table.children('tbody').length > 0)
            this._table.children('tbody').html(content);
        else this._table.append('<tbody>' + content + '</tbody>');
    }
    
    _removeNoItemsInfo() {
        var c = this._table.children('tbody').children('tr');
        if (c.length == 1 && c.hasClass('no-items')) this._table.children('tbody').empty();
    }
    
    constructor (tableId, fields, headers, defaultText) {
        /** Configures the dynamic table. */
        this._tableId = tableId;
        this._table = $('#' + tableId);
        this._fields = fields || null;
        this._headers = headers || null;
        this._defaultText = defaultText || 'No items to list...';
        this._setHeaders();
        this._setNoItemsInfo();
    }

    load (data, append=false){
        /** Loads the specified data to the table body. */
        if (this._table.length > 0){ // configured.
            this._setHeaders();
            this._removeNoItemsInfo();
            if (data && data.length > 0) {
                var rows = '';
                var temp_fields = this._fields;
                $.each(data, function(index, item) {
                    rows += buildRowColumns(temp_fields, item);
                });
                var mthd = append ? 'append' : 'html';
                this._table.children('tbody')[mthd](rows);
            }
            else {
                this._setNoItemsInfo();
            }
        }
    }

    clear(){
        this._setNoItemsInfo();
    }
}

