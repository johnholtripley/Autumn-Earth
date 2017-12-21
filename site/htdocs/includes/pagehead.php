<div id="mastHead" role="banner">
<div class="row">
<div class="small-12 columns">
	<p><a id="menuToggle" class="icon" href="#navigation" aria-label="navigation menu">Menu</a></p>

<?php
if (!$isHomePage) {
	echo '<a href="/" id="autumnEarth">';
}
?>

<picture>
    <source type="image/svg+xml" srcset="/images/autumn-earth.svg">
    <img src="/images/autumn-earth.gif" alt="Autumn Earth" id="logoFallback">
</picture>
<?php
if (!$isHomePage) {
	echo '</a>';
}
?>


</div>
</div>
</div>
<div id="pageContent" role="main">