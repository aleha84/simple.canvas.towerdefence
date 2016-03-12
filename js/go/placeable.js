SCG.Placeable = {
	battlefield : {},
	set: function(go){
		var topLeft = new Vector2(Math.Round(go.position.x - go.size.x), Math.Round(go.position.y - go.size.y));
		for(var x = 0; x<go.size.x;x++){
			for(var y=0;y<.go.size.y;y++){
				var index = String.formt("{0}_{1}", topLeft.x+x, topLeft.y+y);
				if(this.battlefield[index] == undefined) {
					this.battlefield[index] = {};
				}

				if(this.battlefield[index][go.id] == undefined){
					this.battlefield[index][go.id] = go;
				}
			}
		}
	},
	remove: function(go){
		var topLeft = new Vector2(Math.Round(go.position.x - go.size.x), Math.Round(go.position.y - go.size.y));
		var controlSum = go.size.x * go.size.y;
		var deleteCount = 0;
		for(var x = 0; x<go.size.x;x++){
			for(var y=0;y<.go.size.y;y++){
				var index = String.formt("{0}_{1}", topLeft.x+x, topLeft.y+y);
				if(this.battlefield[index]!=undefined && this.battlefield[index][go.id] != undefined){
					delete this.battlefield[index][go.id];
					deleteCount++;
				}
			}
		}
		if(deleteCount != controlSum)
		{
			console.log('removeGlobal called');
			this.removeGlobal(go);
		}
	},
	removeGlobal: function(go){
		var topLeft = new Vector2(Math.Round(go.position.x - go.size.x), Math.Round(go.position.y - go.size.y));
		for (var key in this.battlefield) {
			if (this.battlefield.hasOwnProperty(key) && this.battlefield[key][go.id] != undefined) {
				delete this.battlefield[key][go.id];
			}
		}
	}
}