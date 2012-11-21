function edit_node(node){
    if(node === undefined || node.length == 0) return;
    var txt = node_text(node);
    window.current_node = node;
    $("#editor")[0].value = txt;
    $("#editor").focus();
    move_editor_to_node(node);
};

function node_text(node){
    return node.children("span").text();
};

function set_node_text(node, text){
    return node.children("span").text(text);
};

function swap_with_next(node){
    node.insertAfter(node.next());
    move_editor_to_node(node);
};

function swap_with_previous(node){
    node.prev().insertAfter(node);
    move_editor_to_node(node);
};

function next(node){
    //  return node.next();
    if(node.length === 0) return null
        return $(node.next()[0] || next(node.parents(".node").first()));
};

function prev(node){
    //  return node.prev();
    return $(node.prev()[0] || node.parents(".node").first());
};

function outdent(node){
    node.insertAfter(parent_node(node));
    move_editor_to_node(node);
};

function indent(node){
    node.appendTo(items(node.prev()));
    move_editor_to_node(node);
};

function remove(node){
    edit_node(node.prev() || node.next());
    node.remove();
};

function parent_node(node){
    return node.parents(".node").first()
};

function items(node){
    return node.children("ul");
};

function add_sibling(node){
    return create_node().insertAfter(node);
};

function create_node(){
    return $( "#nodeTemplate" ).tmpl( {name: "", nodes: []} );
};

// enter => add following sibling
// ctrl up => swap with prev
// ctrl down => swap with next
// ctrl right => indent
// ctrl left => outdent
// backspace empty textbox => remove

$(document).keydown(function(event){
    if(event.ctrlKey){
        if(event.keyCode ==  37){ // left
            outdent(window.current_node);
            return false;
        };
        if(event.keyCode ==  39){ // right
            indent(window.current_node);
            return false;
        };
        if(event.keyCode ==  40){ // down
            swap_with_next(window.current_node);
            return false;
        };
        if(event.keyCode ==  38){ // up
            swap_with_previous(window.current_node);
            return false;
        };
    }
    else if(event.altKey){
        if(event.keyCode ==  37){ // left
            edit_node( parent_node(window.current_node));
            return false;
        };
        if(event.keyCode ==  39){ // right
            edit_node(window.current_node.find(".node").first());
            return false;
        };
        if(event.keyCode ==  40){ // down
            edit_node(next(window.current_node));
            return false;
        };
        if(event.keyCode ==  38){ // up
            edit_node(prev(window.current_node));
            return false;
        };
    };
});

function move_editor_to_node(node){
    var p = node.position();
    $("#editor").css("top",p.top -2).css("left", p.left - 2);
};

function on_span_clicked(){
    edit_node($(this).parent());
};

function set_editor_width_from_node(node){
    // uses li  not span
    $("#editor").css("width", window.current_node.css("width"));
}

function update_node_from_editor(){
    if ($("#editor").length > 0) {
        set_node_text(window.current_node, $("#editor")[0].value);
        set_editor_width_from_node(window.current_node);
    } else {
        clearInterval(window.current_interval_check);
    }
};

var rootNode = {name: "My list", nodes:[
    {name: 'Look',nodes:[
        {name: 'Colour the scopes',nodes:[]},
            ]},
        {name: 'Feel',nodes:[
            {name: 'Expand/Collapse',nodes:[]},
            {name: 'Split line with "enter"',nodes:[]},
            ]},
        {name: 'Function',nodes:[
            {name: 'Save',nodes:[]},
            {name: 'Load',nodes:[]},
            {name: 'Undo',nodes:[]},
            ]},
        {name: 'Redo',nodes:[]},
        {name: 'Auto-Save',nodes:[]},
        ]};

$("#editor").jkey('enter', function(){
    edit_node(add_sibling(window.current_node));
}).jkey('backspace', true, function(){
    if(this.value.length == 0) {
        remove(window.current_node);
        return false;
    };
    return true;
}).jkey('down', function(){
    if (window.current_node.find(".node").size()>0) {
        edit_node(window.current_node.find(".node").first());
    } else {
        edit_node(next(window.current_node));
    }
    return false;
}).jkey('up', function(){
    if ( parent_node(window.current_node).find(".node").size()>0 &&
        window.current_node.index() > 0) {
        edit_node(prev(window.current_node));
    } else if (parent_node(window.current_node).size() === 0) {
        if (window.current_node.siblings().size() > 0 && 
            $(window.current_node.siblings()[window.current_node.index() -1]).find('.node').size()>0) {
            edit_node($(window.current_node.siblings()[window.current_node.index() -1]).find('.node').last());
        } else {
            edit_node($(window.current_node.siblings()[window.current_node.index() -1]));
        }
    } else {
        edit_node( parent_node(window.current_node));
    }
    return false;
});

$("#pageTemplate").tmpl(rootNode).appendTo($("#content"));
$(".node > span").live("click", on_span_clicked);
edit_node($(".node").first());
window.current_interval_check = setInterval("update_node_from_editor()",200);

