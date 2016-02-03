<?php

$youtubeAPIKey = 'AIzaSyALCbjNTg-BJbU1a-reQCYlSj85aXg9xdQ';
// https://www.youtube.com/account_advanced :
$youtubeChannelId = 'UCUReqJjDvPDQRI0NRwS8L2A';
$request = 'https://www.googleapis.com/youtube/v3/search?key='.$youtubeAPIKey.'&channelId='.$youtubeChannelId.'&part=snippet,id&order=date&maxResults=20';
$jsonResults = file_get_contents($request);
$json = json_decode($jsonResults, true);
$allYouTubeVideos = [];
foreach($json['items'] as $item) {
	if($item['id']['kind'] == 'youtube#video') {
		// is a video
		$thisVideoId = $item['id']['videoId'];
		array_push($allYouTubeVideos, $thisVideoId);
	}
}
?>
