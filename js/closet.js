
var width = window.innerWidth;
var height = window.innerHeight;
var left_section_object = [];
var mid_section_object = [];
var right_section_object = [];
var step_3 = false;
var summary = {};
summary.hanger_left = "no hanger";
summary.hanger_mid = "no hanger";
summary.hanger_right = "no hanger";




var stage = new Konva.Stage({
    container: 'canvas',
    width: width,
    height: height,
    fill: 'gray'
});

var layer = new Konva.Layer({
    x: 0,
    y: 0,

});
var layer_front = new Konva.Layer({
    x: 0,
    y: 0,
});

var front_text = new Konva.Text({
    x: 5,
    y: 10,
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'grey',
    text: "Outside View(Doors View)"
});
var inner_text = new Konva.Text({
    x: 5,
    y: 10,
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'grey',
    text: "Inside View of Closet"
});
layer_front.add(front_text);
layer.add(inner_text);
stage.add(layer);
stage.add(layer_front);
layer_front.draw();
show_front_side();
var na_left = 10000; // not available region left
var na_mid = 10000; // not available region mid
var na_right = 10000; // not available region right


function Image_draw_static(imageObj, x, y, width, height, id) {
    // var parent = stage.find(parent_id)[0];
    var img = new Konva.Image({
        image: imageObj,
        x: x,
        y: y,
        width: width,
        height: height,
        id: id,
        offsetX: 0,
        offsetY: 0,
    });

   

    layer.add(img);
    stage.add(layer);
    layer.draw();
}
function Image_draw(imageObj, x, y, width, height, layer_, name, id, target_) {
    // var parent = stage.find(parent_id)[0];
    var img = new Konva.Image({
        image: imageObj,
        init_x: x,
        init_y: y,
        x: x,
        y: y,
        width: width,
        height: height,
        draggable: true,
        name: name,
        id: id,
        offsetX: 0,
        offsetY: 0,
        parent: ''
    });

    img.on("")
    img.on("dragstart", function () {
        this.moveToTop();
        let target = stage.find('#' + this.attrs.parent)[0];
        if (target) {
            target.attrs.occupied = false;
            this.attrs.parent = '';


        }


        layer_.draw();

    });

    img.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        layer.draw();
    });
    img.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });
    img.on('dragend', function (e) {

        let target = stage.find(target_);
        let dropped = false;
        //  console.log("target:",target);
        var target_x, target_y, target_width, target_height, x = this.attrs.x, y = this.attrs.y;
        for (var i = 0; i < target.length; i++) {

            let parent = target[i];
            target_x = parent.attrs.x;
            target_y = parent.attrs.y;
            target_width = parent.attrs.width;
            target_height = parent.attrs.height;
            if ((x > target_x && x < (target_width + target_x)) && (y > target_y && y < (target_height + target_y)) && !parent.attrs.occupied) {
                console.log("dropping");
                parent.attrs.occupied = true;
                dropped = true;
                this.attrs.height=target_height;
                this.attrs.parent=parent.attrs.id;
                this.position({
                    x: target_x + ((target_width / 2) - (this.attrs.width / 2)),
                    y: target_y + ((target_height / 2) - (this.attrs.height / 2))
                });
               
                layer_.draw();

            }

        }
        if (!dropped) {
            this.position({
                x: this.attrs.init_x,
                y: this.attrs.init_y
            });
            layer_.draw();
            console.log(e);
        }
    })


    layer_.add(img);
    stage.add(layer_);
    layer_.draw();
}

function closet_dimension() {


    var inches_to_pixel = 4;
    var width = document.getElementById("width_input").value * inches_to_pixel;
    var height = document.getElementById("height_input").value * inches_to_pixel;
    summary.width= width/4;
    summary.height= height/4;
    summary.doors = 3;
    



    if (stage.find("#closet")[0] == undefined) {
        console.log("generating first time closet structure")
        var closet = new Konva.Rect({
            x: 0,
            y: 30,
            width: width + 8,
            height: height + 4,
            fill: '#ffffee',
            stroke: 'gray',
            strokeWidth: 1,
            id: "closet",

        });
        var section_left = new Konva.Rect({
            x: 2,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_left'
        });
        left_section_object[0] = { attrs: { x: 4, y: 32, height: 0, width: (width / 3) - 4 } };
        var section_mid = new Konva.Rect({
            x: (width / 3) + 4,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_mid'

        });
        mid_section_object[0] = { attrs: { x: (width / 3) + 6, y: 32, height: 0, width: (width / 3) - 4 } };

        var section_right = new Konva.Rect({
            x: (2 * (width / 3)) + 6,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_right'

        });
        right_section_object[0] = { attrs: { x: (2 * (width / 3)) + 8, y: 32, height: 0, width: (width / 3) - 4 } };


        // add the shape to the layer


        layer.add(closet);
        layer.add(section_left);
        layer.add(section_mid);
        layer.add(section_right);
        layer_front.add(closet.clone({ id: 'closet_clone' }));
        layer_front.add(section_left.clone({ id: 'section_left_clone' }));
        layer_front.add(section_mid.clone({ id: 'section_mid_clone' }));
        layer_front.add(section_right.clone({ id: 'section_right_clone' }));

        door_change("left");
        door_change("mid");
        door_change("right");
        layer.draw();
        layer_front.draw();
        console.log(stage.find('#closet_clone')[0])

    }
    else {
        //devaring old closet //
        var closet_old = stage.find("#closet")[0];
        var section_left_old = stage.find("#section_left")[0];
        var section_mid_old = stage.find("#section_mid")[0];
        var section_right_old = stage.find("#section_right")[0];
        console.log(closet_old);
        closet_old.destroy();
        section_left_old.destroy();
        section_mid_old.destroy();
        section_right_old.destroy();
        closet_old = stage.find("#closet_clone")[0];
        section_left_old = stage.find("#section_left_clone")[0];
        section_mid_old = stage.find("#section_mid_clone")[0];
        section_right_old = stage.find("#section_right_clone")[0];
        closet_old.destroy();
        section_left_old.destroy();
        section_mid_old.destroy();
        section_right_old.destroy();
        layer.draw();
        layer_front.draw();

        //devaring old closet end//
        console.log("regenerating closet structure");
        var closet = new Konva.Rect({
            x: 0,
            y: 30,
            width: width + 8,
            height: height + 4,
            fill: '#ffffee',
            stroke: 'gray',
            strokeWidth: 1,
            id: "closet",

        });
        var section_left = new Konva.Rect({
            x: 2,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_left'
        });
        left_section_object[0] = { attrs: { x: 4, y: 32, height: 0, width: (width / 3) - 4 } };
        section_mid = new Konva.Rect({
            x: (width / 3) + 4,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_mid'

        });
        mid_section_object[0] = { attrs: { x: (width / 3) + 6, y: 32, height: 0, width: (width / 3) - 4 } };

        var section_right = new Konva.Rect({
            x: (2 * (width / 3)) + 6,
            y: closet.attrs.y + 2,
            width: width / 3,
            height: height,
            fill: '#eeeedd',
            stroke: 'grey',
            strokeWidth: 1,
            id: 'section_right'

        });
        right_section_object[0] = { attrs: { x: (2 * (width / 3)) + 8, y: 32, height: 0, width: (width / 3) - 4 } };

        // add the shape to the layer


        layer.add(closet);
        layer.add(section_left);
        layer.add(section_mid);
        layer.add(section_right);
        layer_front.add(closet.clone({ id: 'closet_clone' }));
        layer_front.add(section_left.clone({ id: 'section_left_clone' }));
        layer_front.add(section_mid.clone({ id: 'section_mid_clone' }));
        layer_front.add(section_right.clone({ id: 'section_right_clone' }));


        // door_left_change();
        // door_mid_change();
        // door_right_change();
        door_change("left");
        door_change("mid");
        door_change("right");

        layer.draw();
        layer_front.draw();
        console.log(left_section_object);

    }


    stage.add(layer);
    layer.draw();
    document.getElementById("proceed_1").style.display = "block";

    console.log("left section", left_section_object);
    console.log("mid section", mid_section_object);
    console.log("right section", right_section_object);


}

function hanger_change(side) {
    console.log("hanger");
    var hanger = document.getElementById("hanger_" + side).value;
    var section;
    switch (side) {
        case 'left':
             if(hanger==="true"){
                 summary.hanger_left = "hanger height 20 inches";
             }
             else{
                summary.hanger_left = "no hanger";

             }
            section = left_section_object;
            break;
        case 'mid':
        if(hanger==="true"){
            summary.hanger_mid = "hanger height 20 inches";
        }
        else{
           summary.hanger_mid = "no hanger";

        }
            section = mid_section_object;
            break;
        case 'right':
        if(hanger==="true"){
            summary.hanger_right = "hanger height 20 inches";
        }
        else{
           summary.hanger_right = "no hanger";

        }
            section = right_section_object;
            break;
    }
    if (hanger === "true") {
        //  var section = stage.find("#section_"+side)[0];
        console.log(section);
        if (section.length == 1) {
            var hanger = new Konva.Rect({
                id: "hanger_" + side,
                offsetX: 0,
                offsetY: 0,
                x: section[0].attrs.x,
                y: section[0].attrs.y + 2,
                fill: "#dddddd",
                stroke: 'grey',
                strokeWidth: 1,
                width: section[0].attrs.width,
                height: 80
            });
            section.push(hanger);
            hanger.on("mousedown", function () {
                alert(hanger.attrs.id);
            })
            hanger.on("mouseover", function () {

            })
            layer.add(hanger);
            layer.draw();


        }
        else {
            document.getElementById('hanger_' + side).selectedIndex = 0;
            document.getElementById('hanger_height_' + side).value = '20';
            console.log("there is hurdle");
        }



    }
    else {
        document.getElementById('hanger_' + side).selectedIndex = 0;
        document.getElementById('hanger_height_' + side).value = '20';
        section.splice(section.findIndex(function (x) {
            x.attrs.id == 'hanger_' + side
        }), 1);

        var hanger = stage.find("#hanger_" + side)[0];
        console.log("destroying hanger left", hanger);
        hanger.destroy();

        layer.draw();
    }
}

function hanger_height_change(e, side) {
    var value = e.value * 4;
    var parent = stage.find("#section_" + side)[0];
    var hanger = stage.find("#hanger_" + side)[0];
    var obj, not_available;
    switch (side) {
        case 'left':
        summary.hanger_left = "hanger height "+value/4+" inches";
            obj = left_section_object;
            not_available = na_left;
            break;
        case 'mid':
        summary.hanger_mid = "hanger height "+value/4+" inches";

            obj = mid_section_object;
            not_available = na_mid;

            break;
        case 'right':
        summary.hanger_right = "hanger height "+value/4+" inches";

            obj = right_section_object;
            not_available = na_right;

            break;
    }

    console.log("obj", obj);
    var hurdle = false;
    for (var i = 1; i < obj.length; i++) {
        if (obj[i].attrs.y <= (value + hanger.attrs.y) && (obj[i].attrs.id != "hanger_" + side)) {
            console.log("hurdle in a way:", obj[i].attrs.id);
            hurdle = true;
        }
    }
    // console.log("parent height:",parent.attrs.height);
    console.log("hanger y:", hanger.attrs.y);
    console.log("value height:", value);
    console.log("na value:", not_available);





    if (value < parent.attrs.height && !hurdle && hanger.attrs.y + value < not_available) {

        hanger.attrs.height = value;
        layer.draw();
    }
    //    else if(value == parent.attrs.height){
    //        e.value = e.value;
    //    }
    else {
        return false;
    }


}
function drawer_add(side) {
    var height = 20;
    var section, not_available;
    switch (side) {
        case 'left':
            section = left_section_object;
            not_available = na_left;
            break;
        case 'mid':
            section = mid_section_object;
            not_available = na_mid;

            break;
        case 'right':
            section = right_section_object;
            not_available = na_right;

            break;

    }

    var x = section[section.length - 1].attrs.x;
    var width = section[section.length - 1].attrs.width;

    var y = section[section.length - 1].attrs.y + section[section.length - 1].attrs.height;
    var lower_boundry = stage.find("#section_" + side)[0].attrs.height + stage.find("#section_" + side)[0].attrs.y;

    console.log("creating a drawer");
    console.log("upper y:", y);
    console.log("lower y:", lower_boundry);
    console.log("lower y-2:", not_available - 2);


    if ((lower_boundry - y - 2) > height && not_available - y - 2 > 20) {
        var drawer = new Konva.Rect({
            id: "drawer_" + side + "_" + Math.floor(Math.random() * 5000 + Math.random() * 5000),
            offsetX: 0,
            offsetY: 0,
            x: x,
            y: y + 2,
            fill: "#dddddd",
            stroke: 'grey',
            strokeWidth: 1,
            width: width,
            height: height,
            side:side,
            name: "drawer",
            occupied: false

        });
        drawer.on("dblclick", function () {
            if(!step_3){
                section.splice(section.findIndex(function (x) { x.attrs.id == drawer.attrs.id }), 1);
                drawer.destroy();
                layer.draw();
                console.log("after", section)
            }
           


        });
        drawer.on("click", function () {
          //  console.log("occupied or not:", this.attrs.occupied);
          if(step_3){
              images_populate('drawers_in');
          }
        })
        layer.add(drawer).draw();
        section.push(drawer);

    }
    else {
        alert("not enough space left");
    }

}

function shelf_add(side) {
    var height = 4;
    var section, not_available;
    switch (side) {
        case 'left':
            section = left_section_object;
            not_available = na_left;
            break;
        case 'mid':
            section = mid_section_object;
            not_available = na_mid;

            break;
        case 'right':
            section = right_section_object;
            not_available = na_right;

            break;

    }

    var x = section[section.length - 1].attrs.x;
    var width = section[section.length - 1].attrs.width;
    var upper_space = 40

    var y = section[section.length - 1].attrs.y + section[section.length - 1].attrs.height;
    var lower_boundry = stage.find("#section_" + side)[0].attrs.height + stage.find("#section_" + side)[0].attrs.y;
    console.log("creating a shelf");
    console.log("upper y:", y);
    console.log("lower y:", lower_boundry);
    if ((lower_boundry - y - upper_space) > height && not_available - y - 2 > height + upper_space) {
        var shelf = new Konva.Rect({
            id: "shelf_" + side + "_" + Math.floor(Math.random() * 5000 + Math.random() * 5000),
            offsetX: 0,
            offsetY: 0,
            x: x,
            side:side,
            y: y + upper_space,
            fill: "#dddddd",
            stroke: 'grey',
            strokeWidth: 1,
            width: width,
            height: height,
            name:'shelf'



        });
        // shelf.on("yChange",(e)=>{
        //     var current_y = e.currentTarget.attrs.y
        //     var lower_bound = stage.find("#section_left")[0].attrs.y+stage.find("#section_left")[0].attrs.height;
        //     console.log(lower_bound);

        shelf.on("click", function () {
            // left_section_object[1].attrs.height =20;
            // console.log(left_section_object[1].attrs);
            console.log("before", left_section_object);

        });
        shelf.on("dblclick", function () {
            //  console.log()

            section.splice(section.findIndex(function (x) { x.attrs.id == shelf.attrs.id }), 1);
            shelf.destroy();
            layer.draw();
            console.log("after", section)
        })


        layer.add(shelf).draw();
        section.push(shelf);

    }
    else {
        alert("not enough space left");
    }


}




function door_change(side) {
    var value = document.getElementById("door_" + side + "_select").value;
    var section = stage.find("#section_" + side)[0];
    var section_outside = stage.find("#section_" + side + "_clone")[0];
   
    if (stage.find("#door_" + side)[0]) {
        var door = stage.find("#door_" + side)[0];
        door.destroy();
        if (stage.find("#drawer_outside_1_" + side)[0]) {
            stage.find("#drawer_outside_1_" + side)[0].destroy();
            if (stage.find("#drawer_outside_2_" + side)[0]) {
                stage.find("#drawer_outside_2_" + side)[0].destroy();

            }


        }
        if (stage.find('#na_' + side + '_img')[0]) {
            stage.find('#na_' + side + '_img')[0].destroy();
        }
        layer.draw();
        layer_front.draw();
    }
    if (value === "full") {
        {
            var door = new Konva.Rect({
                id: "door_"+side,
                x: section_outside.attrs.x,
                y: section_outside.attrs.y,
                width: section_outside.attrs.width,
                height: section_outside.attrs.height,
                stroke: "green",
                strokeWidth: 1,
                name: "door"


            });
           

           
            switch (side) {
                case "left":
                    na_left = 10000;
                    summary.door_left ="full Door";
                    break;
                case "mid":
                    na_mid = 10000;
                    summary.door_mid ="full Door";

                    break;
                case "right":
                    na_right = 10000;
                    summary.door_right ="full Door";

                    break;


            }
            layer_front.add(door);
            layer_front.draw();
        }
    }
    else if (value === "half-1") {
        var door = new Konva.Rect({
            id: "door_"+side,
            x: section_outside.attrs.x,
            y: section_outside.attrs.y,
            width: section_outside.attrs.width,
            height: section_outside.attrs.height * 0.80,
            stroke: "green",
            strokeWidth: 1,
            name: "door"

        });
        switch (side) {
            case "left":
                na_left = door.attrs.y + door.attrs.height;
                summary.door_left = "Door and a outside Drawer"
                break;
            case "mid":
                na_mid = door.attrs.y + door.attrs.height;
                summary.door_mid = "Door and a outside Drawer"

                break;
            case "right":
                na_right = door.attrs.y + door.attrs.height;
                summary.door_right = "Door and a outside Drawer"

                break;


        }


        var drawer_1 = new Konva.Rect({
            id: "drawer_outside_1_" + side,
            x: section_outside.attrs.x,
            y: 2 + section_outside.attrs.y + section_outside.attrs.height * 0.80,
            width: section_outside.attrs.width,
            height: (section_outside.attrs.height * 0.20) - 2,
            stroke: "purple",
            strokeWidth: 1,
            name: 'drawer_out'
        });
        drawer_1.on('click',()=>{
            if(step_3){
                images_populate('drawers_out');
            }
           
        });
        
        layer_front.add(drawer_1);
        layer_front.add(door);
        layer_front.draw();
        if (stage.find("#na_" + side + "_img")[0]) {
            var img = stage.find("#na_" + side + "_img")[0];
            img.position({ x: section.attrs.x, y: section.attrs.y + section.attrs.height * 0.80 });
            img.attrs.height = section.attrs.height * 0.20;
            layer.draw();
        }
        else {
            var img = new Image;
            img.onload = function () {

                Image_draw_static(img, section.attrs.x, section.attrs.y + section.attrs.height * 0.80, section.attrs.width, section.attrs.height * .20, "na_" + side + "_img");
                // Image_draw(imageObj,x,y,width,height,id,parent_id)
            }
            img.src = "../assets/img/grey_stripes.png";
            layer.draw();

        }

    }
    else if (value === "half-2") {
        var door = new Konva.Rect({
            id: "door_"+side,
            x: section_outside.attrs.x,
            y: section_outside.attrs.y,
            width: section_outside.attrs.width,
            height: section_outside.attrs.height * 0.60,
            stroke: "green",
            strokeWidth: 1,
            name:'door'
        });



        var drawer_1 = new Konva.Rect({
            id: "drawer_outside_1_" + side,
            x: section.attrs.x,
            y: 2 + section.attrs.y + section.attrs.height * 0.60,
            width: section.attrs.width,
            height: (section.attrs.height * 0.20) - 2,
            stroke: "purple",
            strokeWidth: 1,
            name: 'drawer_out'


        });
        drawer_1.on('click',()=>{
            if(step_3){
                images_populate('drawers_out');
            }
           
        });
        
        var drawer_2 = new Konva.Rect({
            id: "drawer_outside_2_" + side,
            x: section.attrs.x,
            y: 2 + section.attrs.y + section.attrs.height * 0.80,
            width: section.attrs.width,
            height: (section.attrs.height * 0.20) - 2,
            stroke: "purple",
            strokeWidth: 1,
            name: 'drawer_out'

        });
        drawer_2.on('click',()=>{
            if(step_3){
                images_populate('drawers_out');
            }
           
        })
        switch (side) {
            case "left":
                na_left = door.attrs.y + door.attrs.height;
                summary.door_left = "Door and Two outside Drawers"

                break;
            case "mid":
                na_mid = door.attrs.y + door.attrs.height;
                summary.door_mid = "Door and Two outside Drawers"

                break;
            case "right":
                na_right = door.attrs.y + door.attrs.height;
                summary.door_right = "Door and Two outside Drawers"

                break;


        }

        layer_front.add(drawer_1);
        layer_front.add(drawer_2);

        layer_front.add(door);
        layer_front.draw();
        if (stage.find("#na_" + side + "_img")[0]) {
            var img = stage.find("#na_" + side + "_img")[0];
            img.position({ x: section.attrs.x, y: section.attrs.y + section.attrs.height * 0.60 });
            img.attrs.height = section.attrs.height * 0.40;
            layer.draw();
        }
        else {
            var img = new Image;
            img.onload = function () {

                Image_draw_static(img, section.attrs.x, section.attrs.y + section.attrs.height * 0.60, section.attrs.width, section.attrs.height * .40, "na_" + side + "_img");
                // Image_draw(imageObj,x,y,width,height,id,parent_id)
            }
            img.src = "../assets/img/grey_stripes.png";

        }
    }
        stage.find('.door').on('click',()=>{
            //  console.log('u clicked a door');
            if(step_3){
                images_populate('doors');

            }
            });
    console.log("not available left", na_left);
    console.log("not available mid", na_mid);
    console.log("not available right", na_right);

}

function show_front_side() {
    layer.hide();
    layer_front.show();
    layer_front.draw();

}
function show_inner_side() {
    layer_front.hide();
    layer.show();
    layer.draw();
}
function proceed_1() {
    document.getElementById("closet_dimension_select").style.display = "none";
    document.getElementById("doors_option_select").style.display = "block";
    document.getElementById("select_side").style.display = "block"
}
function proceed_2() {
    document.getElementById("inside_view_options").style.display = "block";
    document.getElementById("doors_option_select").style.display = "none";


}
function proceed_3() {
    // var json = stage.toJSON();
    document.getElementById("left_panel").style.display = "none";
    document.getElementById("summary-btn").style.display = "block";
    step_3 = true;
    // console.log(json);   
    let title = new Konva.Text({
        text: 'Designs to pick \n for Front View',
        x: 500,
        y: 0,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: 'grey',
    });
  //  images_populate('drawers_in');
    layer_front.add(title);
    layer.add(title.clone({ text: 'Designs to pick \n for Inside View' }));
    layer_front.draw();
    layer.draw();
    console.log(stage.find(".drawer"));
}
//////////////////////////////////////////////////////
////////////// drag and drop features addition ////////////////
function images_populate(img) {
    destroy_images();
    var image_list = [{
        'name': 'drawers_in', 'items': [{ 'name': 'drawer-1', 'price': '400' }, { 'name': 'drawer-2', 'price': '500' },
        { 'name': 'drawer-3', 'price': '300' }]
    },
    {
        'name':'doors','items' : [
            {
                'name':'door-1','price':'1000'
            },
            {
                'name':'door-2','price':'1200'
            }
        ]
    }

    ];
    let components, images, layer_to_choose, name, target;
    switch (img) {
        case 'drawers_in':
            components = stage.find(".drawer");
            images = image_list[0].items; // zero index for drawers;
            layer_to_choose = layer;
            name = "drawer_in_img";
            target = '.drawer';

            break;
        case 'drawers_out':
        components = stage.find(".drawer_out");
        images = image_list[0].items; // zero index for drawers;
        layer_to_choose = layer_front;
        name = "drawer_out_img";
        target = '.drawer_out';
            break;
        case 'doors':
        components = stage.find(".door");
        images = image_list[1].items; // zero index for drawers;
        layer_to_choose = layer_front;
        name = "door_img";
        target = '.door';
            break;
        case 'shelfs':
            break;

    }


    let y = 50;
    for (var j = 0; j < images.length; j++) {
        var img = new Image();
        img.onload = function () {
            for (var i = 0; i < components.length; i++) {
                let id = Math.random() * 1000000 + Math.random() * 1000000 * (i + 1);
                console.log("y position:", y);
                // var drawer_parent = stage.find("#drawer_left")[0];
                //S console.log("drawer:",drawer_parent);
                Image_draw(this, 500, y, components[0].attrs.width, components[0].attrs.height, layer_to_choose, name, id, target);
            };
            y = y + components[0].attrs.height + 5;

        }
        img.src = '../assets/img/components/' + images[j].name + '.jpg';



    }





}
function summarize(){
    let drawer =  stage.find('.drawer');
    let shelf =  stage.find('.shelf');
   

    summary.right_drawer=0;
    summary.left_drawer=0;
    summary.mid_drawer=0;
    summary.left_shelf=0;
    summary.mid_shelf=0;
    summary.right_shelf=0;

    for(var i =0 ; i<drawer.length ; i++)
    {
        if(drawer[i].attrs.side==='left')
        {
           summary.left_drawer++;
        }
        else if(drawer[i].attrs.side==='mid')
        {
            summary.mid_drawer++;

        }
        else if(drawer[i].attrs.side==='right')
        {
            summary.right_drawer++;

        }

    }
    for(var i =0 ; i<shelf.length ; i++)
    {
        if(shelf[i].attrs.side==='left')
        {
           summary.left_shelf++;
        }
        else if(shelf[i].attrs.side==='mid')
        {
            summary.mid_shelf++;

        }
        else if(shelf[i].attrs.side==='right')
        {
            summary.right_shelf++;

        }

    }
    let base_price = 400;
    let drawer_price = 10;
    let hanger_price = 30;
    let shelf_price = 5;
    let total = base_price + (drawer_price)*(summary.left_drawer+summary.mid_drawer+summary.right_drawer)+
                (shelf_price)*(summary.left_shelf+summary.mid_shelf+summary.right_shelf);
                summary.total = total;
    document.getElementById("right_panel").style.display = "none";
    document.getElementById("summary_div").style.display = "block";
    let table =  document.getElementById("summary");
    let str = 
   ` <tr><th colspan='1'>Width (inches)</th><td colspan='1'>`+summary.width+`</td>
   <th colspan='1'>Height (inches)</th><td colspan='1'>`+summary.width+`</td>
   <th colspan='1'>Total Price(dollars)</th><td colspan='1'>`+summary.total+`</td>
   
   </tr>
    
    <tr><th scope="col" colspan='2'>LEFT SECTION</th><th colspan='2'>MID SECTION</th><th colspan='2'>RIGHT SECTION</th></tr>
    <tr><th> Door</th><td>`+summary.door_left+`</td><th> Door</th><td>`+summary.door_mid+`</td><th> Door</th><td>`+summary.door_right+`</td></tr>
    <tr><th> Hanger</th><td>`+summary.hanger_left+`</td><th> Hanger</th><td>`+summary.hanger_mid+`</td><th> Hanger</th><td>`+summary.hanger_right+`</td></tr>
    <tr><th> Drawer</th><td>`+summary.left_drawer+`</td><th> Drawer</th><td>`+summary.mid_drawer+`</td><th> Drawer</th><td>`+summary.right_drawer+`</td></tr>
    <tr><th> Shelf</th><td>`+summary.left_shelf+`</td><th> Shelf</th><td>`+summary.mid_shelf+`</td><th> Shelf</th><td>`+summary.right_shelf+`</td></tr>

    `;
    table.innerHTML = str;


    
    console.log(summary);
   
}
function destroy_images(){
    let images = stage.find('Image');
  //  console.log(images);
    for(var i=0; i< images.length ; i++ )
    {
        if((images[i].attrs.id !='na_mid_img' ||
        images[i].attrs.id !='na_left_img' ||
        images[i].attrs.id !='na_right_img') && images[i].attrs.parent ==="" ) 
        {
            images[i].destroy();
        
        }
    }
    layer.draw();
    layer_front.draw();
}
