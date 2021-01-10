$(".pasteprompt").click(() => {
  $(".paste").focus();
});

$(".paste").keyup(() => {
  if (!/^<img +src *= *["'].+["'].+>$/i.test($(".paste").html())) {
    alert("Not an image!") ; location.reload()
  }
  $(".reset").slideDown(200);
  $(".paste").removeAttr("contenteditable");
  $(".data").val($(".paste img").attr("src"));
})

$(".reset").click(() => {
  if(confirm("Are you sure?")) location.reload();
})