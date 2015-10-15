<?php
$results = array();
foreach ($_POST['containers'] as $container) {
  $results[] = file_put_contents("../" . $container['file'], $container['content']);
}
echo json_encode($results);
?>