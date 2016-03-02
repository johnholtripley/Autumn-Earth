<?php
// get youttube videos:
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
		$thisVideoPublishedAt = strtotime($item['snippet']['publishedAt']);
		array_push($allYouTubeVideos, array($thisVideoId,$thisVideoPublishedAt));
	}
}
?>











<?php
// get tweets:
	/**
	 * Twitter feed which uses twitteroauth for authentication
	 * 
	 * @version	1.0
	 * @author	Andrew Biggart
	 * @link	https://github.com/andrewbiggart/latest-tweets-php-o-auth/
	 * 
	 * Notes:
	 * Caching is employed because Twitter only allows their RSS and json feeds to be accesssed 150
	 * times an hour per user client.
	 * --
	 * Dates can be displayed in Twitter style (e.g. "1 hour ago") by setting the 
	 * $twitter_style_dates param to true.
	 *
	 * You will also need to register your application with Twitter, to get your keys and tokens.
	 * You can do this here: (https://dev.twitter.com/).
	 *
	 * Don't forget to add your username to the bottom of the script.
	 * 
	 * Credits:
	 ***************************************************************************************
	 * Initial script before API v1.0 was retired
	 * http://f6design.com/journal/2010/10/07/display-recent-twitter-tweets-using-php/
	 *
	 * Which includes the following credits
	 * Hashtag/username parsing based on: http://snipplr.com/view/16221/get-twitter-tweets/
	 * Feed caching: http://www.addedbytes.com/articles/caching-output-in-php/
	 * Feed parsing: http://boagworld.com/forum/comments.php?DiscussionID=4639
	 ***************************************************************************************
	 *
	 ***************************************************************************************
	 * Authenticating a User Timeline for Twitter OAuth API V1.1
	 * http://www.webdevdoor.com/php/authenticating-twitter-feed-timeline-oauth/
	 ***************************************************************************************
	 *
	 ***************************************************************************************
	 * Twitteroauth which has been used for the authentication process
	 * https://github.com/abraham/twitteroauth
	 ***************************************************************************************
	 *
	 *
	**/
	
	// Set timezone. (Modify to match your timezone) If you need help with this, you can find it here. (http://php.net/manual/en/timezones.php)
	date_default_timezone_set('Europe/London');
	
	// Require TwitterOAuth files. (Downloadable from : https://github.com/abraham/twitteroauth)


	require_once($_SERVER['DOCUMENT_ROOT']."/includes/third-party/latest-tweets-php-o-auth/twitteroauth/twitteroauth/twitteroauth.php");
	
	
	// Function to authenticate app with Twitter.
	function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
	  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
	  return $connection;
	}
	
$tweetsList = array();

	// Function to display the latest tweets.
	function display_latest_tweets(
		
		// Function parameters.
		$twitter_user_id,
		$cache_file          = '/includes/tweets.txt',  // Change this to the path of your cache file. (Default : ./tweets.txt)
		$tweets_to_display   = 10,               // Number of tweets you would like to display. (Default : 5)
		$ignore_replies      = true,           // Ignore replies from the timeline. (Default : false)
		$include_rts         = true,           // Include retweets. (Default : false)
		$twitter_wrap_open   = '',
		$twitter_wrap_close  = '',
		$tweet_wrap_open     = '<div class="twitter">',
		$meta_wrap_open      = '<span class="tweetDate">',
		$meta_wrap_close     = '</span>',
		$tweet_wrap_close    = '</div>',
		$date_format         = 'g:i A jS F',    // Date formatting. (http://php.net/manual/en/function.date.php)
		$twitter_style_dates = true){           // Twitter style days. [about an hour ago] (Default : true)
			
		// Twitter keys (You'll need to visit https://dev.twitter.com and register to get these.
		$consumerkey         = "bHbRQksxJBsGElUdS8EDEfXZx";
		$consumersecret      = "wf4SDFZxuRTpvCD97uL0dGb2piLrsCKFEUWWjfoSKZdwLUQUA6";
		$accesstoken         = "78302536-L38EcmSi4C32FuOUFN8hyh6apif8FfPMMh5IItmRE";
		$accesstokensecret   = "B9Jb6hvZgt5bzx05vd0H44PEkpVjsMM7qGZJIBsRxMDxV";
		
		// Seconds to cache feed (Default : 3 minutes).
		$cachetime           = 3*60;
		
		global $tweetsList;

$cache_file = $_SERVER['DOCUMENT_ROOT'].$cache_file;

		// Time that the cache was last updtaed.
		$cache_file_created  = ((file_exists($cache_file))) ? filemtime($cache_file) : 0;
 
		// A flag so we know if the feed was successfully parsed.
		$tweet_found         = false;
		
		// Show cached version of tweets, if it's less than $cachetime.
		if (time() - $cachetime < $cache_file_created) {
	 		$tweet_found = true;
	 		
	 	
	 		
			// Display tweets from the cache.
			//readfile($cache_file);		 

$jsonResults = file_get_contents($cache_file);
$tweetsList = json_decode($jsonResults, true);

		} else {
		
		// Cache file not found, or old. Authenticae app.
		$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
		
			if($connection){
		
				// Get the latest tweets from Twitter
				// get 20 to allow for replies being excluded




 				$get_tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitter_user_id."&count=20&include_rts=".$include_rts."&exclude_replies=".$ignore_replies);
				
				// Error check: Make sure there is at least one item.
				if (count($get_tweets)) {
 					
					// Define tweet_count as zero
					$tweet_count = 0;
 
					// Start output buffering.
				//	ob_start();
 
					// Open the twitter wrapping element.
				//	$twitter_html = $twitter_wrap_open;
 

 
					// Iterate over tweets.
					foreach($get_tweets as $tweet) {
						$twitter_html = '';
						$retweetScreenName = "";
							$tweet_found = true;
							$tweet_count++;
 							$tweet_desc = $tweet->text;
 							$tweetUrl = $tweet->id_str;

// me addtion - check for retweets
 							 $entities = $tweet->entities;
if(isset($tweet->retweeted_status)) {
	$retweetScreenName = 'Retweeted <a href="https://twitter.com/'.$tweet->retweeted_status->user->screen_name.'">'.$tweet->retweeted_status->user->name .'</a>: ';
	$tweet_desc = $tweet->retweeted_status->text;


}

// --------------


							// Add hyperlink html tags to any urls, twitter ids or hashtags in the tweet.
							$tweet_desc = preg_replace("/((http)+(s)?:\/\/[^<>\s]+)/i", "<a href=\"\\0\" target=\"_blank\">\\0</a>", $tweet_desc );
							$tweet_desc = preg_replace("/[@]+([A-Za-z0-9-_]+)/", "<a href=\"http://twitter.com/\\1\" target=\"_blank\">\\0</a>", $tweet_desc );
							$tweet_desc = preg_replace("/[#]+([A-Za-z0-9-_]+)/", "<a href=\"http://twitter.com/search?q=%23\\1\" target=\"_blank\">\\0</a>", $tweet_desc );
 
if($retweetScreenName != '') {
	$tweet_desc = $retweetScreenName . $tweet_desc;
}
$tweet_desc = nl2br($tweet_desc);
// me addition
 
 // replace t.co links with expanded URL
// https://dev.twitter.com/overview/api/entities-in-twitter-objects#urls

 if(!empty($entities->urls[0]->expanded_url)) {
$tweet_desc = str_replace($entities->urls[0]->url, $entities->urls[0]->expanded_url, $tweet_desc);
}
 if(!empty($entities->media[0]->media_url)) {
 	//$tweet_desc .= '<img src="'.$entities->media[0]->media_url_https.'">';

$stringToReplace = '<a href="'.$entities->media[0]->url.'" target="_blank">'.$entities->media[0]->url.'</a>';
 $tweet_desc = str_replace($stringToReplace, '<img alt="sourced from '.$entities->media[0]->expanded_url.'" src="'.$entities->media[0]->media_url_https.'">', $tweet_desc);

 	}

// $tweet_desc = htmlentities($tweet_desc);



 	


// #####################
 
 							// Convert Tweet display time to a UNIX timestamp. Twitter timestamps are in UTC/GMT time.
							$tweet_time = strtotime($tweet->created_at);	
 							if ($twitter_style_dates){
								// Current UNIX timestamp.
								$current_time = time();
								$time_diff = abs($current_time - $tweet_time);
								switch ($time_diff) 
								{
									case ($time_diff < 60):
										$display_time = $time_diff.' seconds ago';                  
										break;      
									case ($time_diff >= 60 && $time_diff < 3600):
										$min = floor($time_diff/60);
										$display_time = $min.' minutes ago';                  
										break;      
									case ($time_diff >= 3600 && $time_diff < 86400):
										$hour = floor($time_diff/3600);
										$display_time = 'about '.$hour.' hour';
										if ($hour > 1){ $display_time .= 's'; }
										$display_time .= ' ago';
										break;          
									default:
									//	$display_time = date($date_format,$tweet_time);
									// g:i A jS F
									$display_time = date('g:i A j',$tweet_time) . '<sup>' . date('S',$tweet_time) . '</sup> ' . date('F',$tweet_time);
									
										break;
								}
 							} else {
 								$display_time = date($date_format,$tweet_time);
 							}
 
 
 $tweetOutput=html_entity_decode($tweet_desc);
 /*
 $tweetOutput = str_replace("<img>", "&lt;img&gt;", $tweetOutput);
$tweetOutput = str_replace("<canvas>", "&lt;canvas&gt;", $tweetOutput);
$tweetOutput = str_replace("<picture>", "&lt;picture&gt;", $tweetOutput);
$tweetOutput = str_replace("<td>", "&lt;td&gt;", $tweetOutput);
$tweetOutput = str_replace("<tr>", "&lt;tr&gt;", $tweetOutput);
*/

 
 
							// Render the tweet.
							$twitter_html .= $tweet_wrap_open.$tweetOutput.$meta_wrap_open.'<a href="http://twitter.com/statuses/'.$tweetUrl.'">'.$display_time.'</a>'.$meta_wrap_close.$tweet_wrap_close;
 
						// If we have processed enough tweets, stop.
						if ($tweet_count >= $tweets_to_display){
							break;
						}
 array_push($tweetsList,array($twitter_html,$tweet_time));

					}
 
					// Close the twitter wrapping element.
				//	$twitter_html .= $twitter_wrap_close;
					

					
 
					// Generate a new cache file.
					$file = fopen($cache_file, 'w');
 
					// Save the contents of output buffer to the file, and flush the buffer. 
					fwrite($file, json_encode($tweetsList)); 
					fclose($file); 
					//ob_end_flush();
					
				}
				
			} 
			
		}
		
	}
	




// get tumblr images:
	$tumblrConsumerKey = 'rg4UKpRb10qxlh7eP00CcqfJnYay9ndXC1dm7P1aQA5rqVIlkQ';
//	$tumblrSecretKey = 'iKx5X4zZqjG8rPhM8vA3n05dTAt50JagZBcvHAc6SyKfrcpkNw';

$tumblrRequest = 'https://api.tumblr.com/v2/blog/autumnearth.tumblr.com/posts/photo?api_key='.$tumblrConsumerKey;

$tumblrJsonResults = file_get_contents($tumblrRequest);
$tumblrJson = json_decode($tumblrJsonResults, true);
$allTumblrImages = [];



foreach($tumblrJson['response']['posts'] as $item) {
	if($item['type'] == 'photo') {
		// is a video

$thisPostURL = $item['post_url'];

		$thisImageUrl = $item['photos'][0]['original_size']['url'];
		$altText = strip_tags($item['caption']);

		$thisImageSource = '<div class="tumblr"><a href="'.$thisPostURL.'" title="View this post on Tumblr"><img src="'.$thisImageUrl.'" alt="'.$altText.'"></a></div>';

		$thisImagePublishedAt = strtotime($item['date']);
		array_push($allTumblrImages, array($thisImageSource,$thisImagePublishedAt));
	}
}




?>