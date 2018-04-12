// CUSTOM JS FILE //
window.addEventListener('load',init);

function init(){
    // on page load, get data and render
    getData();
}

function getData(){
    $.ajax({
        url: '/api/get',
        type: 'GET',
        failure: function(err){
            console.log ("Could not get the data");
            return alert("Something went wrong");
        },
        success: function(data) {
            console.log(data);
            var animals = data.animals;
            animals.forEach(function(currentAnimal){
                var htmlToAppend = '<p>'+currentAnimal.name+'</p>'+
                '<img src="'+currentAnimal.url+'" />'+
                '<a href="/api/delete/'+currentAnimal._id+'">Delete</a>'+
                '<br/>'+
                '<a href="/edit/'+currentAnimal._id+'">Edit</a>';
                $('body').append(htmlToAppend);
            })
        }
    });
}
