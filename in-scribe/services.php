<?php
function inscribe( $contentName ){
  echo '<div class="easy-writer" data-ezw-file="'.$contentName.'">';
  include($contentName);
  echo '</div>';
}
?>