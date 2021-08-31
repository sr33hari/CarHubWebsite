<?php
	extract($_POST);
  //validate
  $arr=array('Message'=>'Success','Cookie'=>"username=".$uname.";");
	echo json_encode($arr);
?>
