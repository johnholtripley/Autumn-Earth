<?php
 
function correctAttribute( $attr ) {
    // strip quotes out:
    $attr = str_ireplace( "'", "", $attr );
    $attr = str_ireplace( '"', '', $attr );
 
    // check attribute has http://
    if ( strtolower( substr( $attr, 0, 3 ) == "www" ) ) {
        $attr = "http://".$attr;
    }
    return $attr;
}
//
 
 
function removeSquareBracketCodes($originaltext) {
    // remove all forum formating code [b] or [image] etc
    return preg_replace('/\[.*?\]/','',$originaltext);
}
 
function cleanText( $originaltext ) {
    // for banned word lists
    $bannedwords = array( "fuck", "piss", "cunt", "wanker", "bastard", "twat", "cock", "rape", "wank", "shit" );
    $replacewords = array( "****", "****", "****", "******", "*******", "****", "****", "****", "****", "****" );
    $amendedtext = $originaltext;
    for ( $i = 0; $i<count( $bannedwords ); $i++ ) {
        // loop through banned word list
        $amendedtext = str_ireplace( $bannedwords[$i], $replacewords[$i], $amendedtext );
    }
 
 
    // ensures that any code is nested correctly and has valid open and close pairs
    $validopentag = array( 'b]', 'i]', 'u]', 's]', 'h]' );
    $validclosetag = array( '/b]', '/i]', '/u]', '/s]', '/h]' );
    $openlist = array();
    $splittext = explode( "[", $amendedtext );
    if ( count( $splittext ) > 0 ) {
        $i = 0;
        while ( $i < count( $splittext ) ) {
            $tagsearch = ( array_search( substr( strtolower( $splittext[$i] ), 0, 2 ), $validopentag ) );
            if ( is_numeric( $tagsearch ) ) {
                // ie. isn't false;
                array_push( $openlist, $tagsearch );
                // add [ back in now it's been checked
                $splittext[$i] = "[".$splittext[$i];
            } else {
                // check for close tags
                $tagsearch = ( array_search( substr( strtolower( $splittext[$i] ), 0, 3 ), $validclosetag ) );
                if ( is_numeric( $tagsearch ) ) {
                    // check if there are any tags on the open list:
                    if ( count( $openlist ) == 0 ) {
                        // remove this tag:
                        $splittext[$i]=substr( $splittext[$i], 3 );
                    } else {
                        // check if this tag corresponds to the last open tag:
                        $lastelement = array_pop( $openlist );
                        if ( $tagsearch == $lastelement ) {
                            // is fine and can be removed from the list
                            // add [ back in now it's been checked
                            $splittext[$i] = "[".$splittext[$i];
                        } else {
                            // add the element back in
                            array_push( $openlist, $lastelement );
                            // remove this tag:
                            $splittext[$i]=substr( $splittext[$i], 3 );
                        }
                    }
                } else {
                    // check for [quote] and [link]
 
                    if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 4 ) == "link" ) {
                        // find '=' after link
                        $equalpos = stripos( $splittext[$i], '=' );
                        if ( $equalpos !== false ) {
                            // find closing ']'
                            $closetag = stripos( $splittext[$i], ']', $equalpos );
                            if ( $closetag !== false ) {
                                // is a valid link tag, add to open list
                                array_push( $openlist, 100 );
                                $splittext[$i] = "[".$splittext[$i];
                            }
                        } else {
                            // add [ back in now it's been checked
                            $splittext[$i] = "[".$splittext[$i];
                        }
                    } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 6 ) == "/link]" ) {
                            // is a valid close link tag,
                            // check if this tag corresponds to the last open tag:
                            $lastelement = array_pop( $openlist );
                            if ( $lastelement != 100 ) {
                                // add the element back in
                                array_push( $openlist, $lastelement );
                                // remove this tag:
                                $splittext[$i]=substr( $splittext[$i], 6 );
                            } else {
                                $splittext[$i] = "[".$splittext[$i];
                            }
                        } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "quote" ) {
                            // find '=' after link
                            $equalpos = stripos( $splittext[$i], '=' );
                            if ( $equalpos !== false ) {
                                // find closing ']'
                                $closetag = stripos( $splittext[$i], ']' );
                                if ( $closetag !== false ) {
                                    // is a valid link tag, add to open list
                                    array_push( $openlist, 101 );
                                    $splittext[$i] = "[".$splittext[$i];
                                }
                            } else {
                                // add [ back in now it's been checked
                                $splittext[$i] = "[".$splittext[$i];
                            }
                        } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 7 ) == "/quote]" ) {
                            // is a valid close link tag,
                            // check if this tag corresponds to the last open tag:
                            $lastelement = array_pop( $openlist );
                            if ( $lastelement != 101 ) {
                                // add the element back in
                                array_push( $openlist, $lastelement );
                                // remove this tag:
                                $splittext[$i]=substr( $splittext[$i], 7 );
                            } else {
                                $splittext[$i] = "[".$splittext[$i];
                            }
                        } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "image" ) {
                            // check for image
 
                            // find '=' after link
                            $equalpos = stripos( $splittext[$i], '=' );
                            if ( $equalpos !== false ) {
                                // find closing ']'
                                $closetag = stripos( $splittext[$i], ']' );
                                if ( $closetag !== false ) {
                                    // is a valid image tag - check if any open tags and close them all:
 
                                    $closeTagstoAdd = "";
                                    // check for any elements within the openlist:
                                    if ( count( $openlist ) > 0 ) {
 
                                        // reverse array so tags are closed in correct order:
                                        $openlist = array_reverse( $openlist );
                                        $j = 0;
                                        while ( $j < count( $openlist ) ) {
                                            switch ( $openlist[$j] ) {
                                            case 100:
                                                // need close link
                                                $closeTagstoAdd .= '[/link]';
                                                break;
                                            case 101:
                                                $closeTagstoAdd .= '[/quote]';
                                                break;
                                            default:
                                                $closeTagstoAdd .= '['.$validclosetag[$openlist[$j]];
                                            }
                                            $j++;
                                        }
                                    }
 
 
 
                                    // clear open list now:
                                    $openlist = array();
                                    // add [ back in
                                    $splittext[$i] = $closeTagstoAdd."[".$splittext[$i];
 
                                }
                            } else {
                                // add [ back in now it's been checked
                                $splittext[$i] = "[".$splittext[$i];
                            }
 
                        } else {
                        // need to add the [ back in - except on the very first element:
                        if ( $i != 0 ) {
                            $splittext[$i] = "[".$splittext[$i];
                        }
                    }
                }
            }
            $i++;
        }
    }
 
    // check for any elements within the openlist:
    if ( count( $openlist ) > 0 ) {
        // reverse array so tags are closed in correct order:
        $openlist = array_reverse( $openlist );
        $i = 0;
        while ( $i < count( $openlist ) ) {
            switch ( $openlist[$i] ) {
            case 100:
                // need close link
                array_push( $splittext, '[/link]' );
                break;
            case 101:
                array_push( $splittext, '[/quote]' );
                break;
            default:
                array_push( $splittext, '['.$validclosetag[$openlist[$i]] );
            }
            $i++;
        }
    }
 
    // rebuild string:
    $amendedtext = implode( "", $splittext );
    return $amendedtext;
}
//
 
 
function parseCode( $toparse ) {
 
    $amendedtext = smartPunctuation( $toparse );
 
    // for code parsing
    $validTags = array( '[b]', '[i]', '[u]', '[s]', '[h]', '[/b]', '[/i]', '[/u]', '[/s]', '[/h]', '[/link]', '[/quote]' );
    $replaceTags = array( '<strong>', '<em>', '<span class="Underline">', '<del>', '<span class="Header">', '</strong>', '</em>', '</span>', '</del>', '</span>', '</a>', '</p></blockquote><p>' );
    // for smilies:
    $validSmilieCode = array( ':)', ':(' );
    $SmilieReplace = array( '<img src="/images/forum/happy-face.gif" width="20" height="20" alt="Happy Smilie" />', '<img src="/images/forum/sad-face.gif" width="20" height="20" alt="Sad Smilie">' );
 
 
    for ( $i = 0; $i<count( $validTags ); $i++ ) {
        $amendedtext = str_ireplace( $validTags[$i], $replaceTags[$i], $amendedtext );
    }
    //
    for ( $i = 0; $i<count( $validSmilieCode ); $i++ ) {
        $amendedtext = str_ireplace( $validSmilieCode[$i], $SmilieReplace[$i], $amendedtext );
    }
 
    // check for [link [quote and [image
 
 
    $splittext = explode( "[", $amendedtext );
    $linkpos = null;
    if ( count( $splittext ) > 0 ) {
        $i = 0;
        while ( $i < count( $splittext ) ) {
 
            if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 4 ) == "link" ) {
                // find '=' after link
                $equalpos = stripos( $splittext[$i], '=' );
                if ( $equalpos !== false ) {
                    // find closing ']'
                    $closetag = stripos( $splittext[$i], ']', $equalpos );
                    if ( $closetag !== false ) {
                        $attrlength = $closetag-$equalpos-1;
                        $attribute = trim( substr( $splittext[$i], $equalpos+1, $attrlength ) );
                        $attribute = correctAttribute( $attribute );
                        // check for blank attribute:
                        if ( $attribute == "" ) {
                            $attribute = "#";
                        }
                        // do replacement:
                        $splittext[$i] = substr( $splittext[$i], 0, $linkpos ) . "<a href=\"" . $attribute. "\" target=\"_blank\" title=\"" . $attribute . "\">" .substr( $splittext[$i], ( $closetag+1 ) );
 
                    }
                }
            } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "quote" ) {
                    // find '='
                    $equalpos = stripos( $splittext[$i], '=' );
                    if ( $equalpos !== false ) {
                        // find closing ']'
                        $closetag = stripos( $splittext[$i], ']', $equalpos );
                        if ( $closetag !== false ) {
                            $attrlength = $closetag-$equalpos-1;
                            $attribute = trim( substr( $splittext[$i], $equalpos+1, $attrlength ) );
                            $attribute = correctAttribute( $attribute );
 
                            // check for blank attribute:
                            if ( $attribute == "" ) {
                                // do replacement:
                                $splittext[$i] = substr( $splittext[$i], 0, $linkpos ) . "</p><blockquote><p>Quote<br />" .substr( $splittext[$i], ( $closetag+1 ) );
                            } else {
                                // do replacement:
                                $splittext[$i] = substr( $splittext[$i], 0, $linkpos ) . "</p><blockquote><p>Quote - originally posted by <strong>".$attribute."</strong><br />" .substr( $splittext[$i], ( $closetag+1 ) );
                            }
                        }
                    }
 
                } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "image" ) {
 
                    // find '='
                    $equalpos = stripos( $splittext[$i], '=' );
                    if ( $equalpos !== false ) {
                        // find closing ']'
                        $closetag = stripos( $splittext[$i], ']', $equalpos );
                        if ( $closetag !== false ) {
                            $attrlength = $closetag-$equalpos-1;
                            $attribute = trim( substr( $splittext[$i], $equalpos+1, $attrlength ) );
                            $attribute = correctAttribute( $attribute );
 
                            // check for blank attribute:
                            if ( $attribute == "" ) {
                                // no image path, so don't display anything:
                                $splittext[$i] = substr( $splittext[$i], 0, $linkpos ) . substr( $splittext[$i], ( $closetag+1 ) );
                            } else {
                                // do replacement:
                                $splittext[$i] = substr( $splittext[$i], 0, $linkpos ) . "</p><div class=\"LinkedImage\"><img src=\"" . $attribute. "\" alt=\"Image - " . $attribute . "\"></div><p>" .substr( $splittext[$i], ( $closetag+1 ) );
                            }
 
 
 
                        }
                    }
                } else if ( $i != 0 ) {
                    $splittext[$i] = '['.$splittext[$i];
                }
            $i ++;
 
 
        }
 
    }
 
    // rebuild the string:
    $amendedtext = implode( "", $splittext );
 
    return $amendedtext;
}
 
 
function smartPunctuation( $toPunctuate ) {
 
 
    // open quotes = &ldquo;
    // close quotes = &rdquo;
    // curled apostrophe = &rsquo;
 
 
    // do open quotes at string start:
    $toPunctuate = preg_replace( '#(^)"(.)#', "\\1&ldquo;\\2", $toPunctuate );
    $toPunctuate = preg_replace( '#(([[:space:]])"(.))+#', "\\2&ldquo;\\3", $toPunctuate );
 
 
    // do close quotes not at string end:
    $toPunctuate = preg_replace( '#((.)"([[:space:]]))+#', "\\2&rdquo;\\3", $toPunctuate );
    // do close quotes at string end:
    $toPunctuate = preg_replace( '#(.)"($)#', "\\1&rdquo;\\2", $toPunctuate );
 
 
    // do apostrophes:
    $toPunctuate = preg_replace( '#(.)\'(.)#', "\\1&rsquo;\\2", $toPunctuate );
 
    // convert any ... to ellipsis character:
    $toPunctuate = str_ireplace( "#...#", "&hellip;", $toPunctuate );
 
    // convert any line breaks to <br>
    $toPunctuate = nl2br( $toPunctuate );
 
    return $toPunctuate;
}
 
function stripCode( $toparse ) {
    $validTags = array( '[b]', '[i]', '[u]', '[s]', '[h]', '[/b]', '[/i]', '[/u]', '[/s]', '[/h]', '[/link]', '[/quote]', ':)', ':(' );
    $amendedtext = $toparse;
    for ( $i = 0; $i<count( $validTags ); $i++ ) {
        $amendedtext = str_ireplace( $validTags[$i], "", $amendedtext );
    }
    // remove any [link], [quote] or [image]:
 
    $splittext = explode( "[", $amendedtext );
    if ( count( $splittext ) > 0 ) {
        $i = 0;
        while ( $i < count( $splittext ) ) {
 
            if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 4 ) == "link" ) {
                // find '=' after link
                $equalpos = stripos( $splittext[$i], '=' );
                if ( $equalpos !== false ) {
                    // find closing ']'
                    $closetag = stripos( $splittext[$i], ']', $equalpos );
                    if ( $closetag !== false ) {
 
                        // is a link tag:
 
                        $splittext[$i] = substr( $splittext[$i], $closetag+1 );
 
                    }
                }
            } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "quote" ) {
                    // find '='
                    $equalpos = stripos( $splittext[$i], '=' );
                    if ( $equalpos !== false ) {
                        // find closing ']'
                        $closetag = stripos( $splittext[$i], ']', $equalpos );
                        if ( $closetag !== false ) {
 
 
                            // is a [quote] tag
                            $splittext[$i] = substr( $splittext[$i], $closetag+1 );
 
                        }
                    }
 
                } else if ( substr( strtolower( trim( $splittext[$i] ) ), 0, 5 ) == "image" ) {
 
                    // find '='
                    $equalpos = stripos( $splittext[$i], '=' );
                    if ( $equalpos !== false ) {
                        // find closing ']'
                        $closetag = stripos( $splittext[$i], ']', $equalpos );
                        if ( $closetag !== false ) {
 
 
 
                            // is an [image] tag
                            $splittext[$i] = substr( $splittext[$i], $closetag+1 );
 
 
                        }
                    }
                }
            $i ++;
 
 
        }
 
    }
 
    // rebuild the string:
    $amendedtext = implode( "", $splittext );
 
    return $amendedtext;
}
//
function highlight( $textcontent, $highlight ) {
    // do a case in-sensitive match to highlight a block of text with a given string
    $tempstring = "";
    $hilightlen = strlen( $highlight );
    $i = 0;
    while ( $i<strlen( $textcontent ) ) {
        $check = substr( $textcontent, $i, $hilightlen );
        if ( strcasecmp( $check, $highlight ) == 0 ) {
            // have a case in-sensitive match:
            $tempstring .= '<span class="highlight">'.$check.'</span>';
            $i += $hilightlen;
        } else {
            $tempstring .= substr( $textcontent, $i, 1 );
            $i++;
        }
    }
    return $tempstring;
}
//
//
function htmlCharsToEntities( $textcontent ) {
    // convert html characters to entites, including single quotes
    $textcontent = htmlspecialchars( $textcontent, ENT_QUOTES );
    //$textcontent = str_replace("'","&#039;",$textcontent);
    // check if magic quotes is on, and add slashes if not
    if ( !get_magic_quotes_gpc() ) {
        $textcontent = addslashes( $textcontent );
    }
    return $textcontent;
}
//
function removeItemFromInv( $characterId, $slotNumber, $quantity ) {
    // get this character's inventory
    $filename = "../data/chr".$characterId."/base.txt";
    if ( $fp = fopen( $filename, "r" ) ) {
        $data = fread( $fp, filesize( $filename ) );
        // separate the whole string into variables
        parse_str( $data );
        fclose( $fp );
        //
        $inventorycontentsarray = array();
        // convert inventory array from string:
        $inventorysplit = explode( "/", $inventorysave );
        for ( $i = 0; $i<count( $inventorysplit ); $i++ ) {
            $inventorycontentsarray[$i] = explode( ",", $inventorysplit[$i] );
        }
        // reduce quantity
        $inventorycontentsarray[$slotNumber][1] -= $quantity;
        if ( $inventorycontentsarray[$slotNumber][1] == 0 ) {
            // no item, so set type to blank as well:
            $inventorycontentsarray[$slotNumber][0] = "1";
        }
        // rebuild the inventory string:
        $inventorysplit = array();
        for ( $i=0; $i<count( $inventorycontentsarray ); $i++ ) {
            $inventorysplit[$i] = implode( ",", $inventorycontentsarray[$i] );
        }
        $inventorystring = implode( "/", $inventorysplit );
        // rebuild the entire string:
        $toSave = "codeversion=" . $codeversion . "&playsounds=" . $playsounds . "&herox=" . $herox . "&heroy=" . $heroy . "&money=" .$money . "&dowseskill=" . $dowseskill  . "&famskill=" . $famskill  . "&currentmapnumber=" . $currentmapnumber . "&currentbag=" . $currentbag . "&heightgained=" . $heightgained . "&inventorysave=" . $inventorystring . "&journalsave=" . $journalsave . "&questsstatus=" . $questsstatus . "&petsave=" . $petsave . "&charname=" . $charname;
        // write string:
        if ( $fs=fopen( $filename, "w" ) ) {
            fwrite( $fs, $toSave );
            fclose( $fs );
        }
    }
}
//
function timeRemaining( $timeremaining ) {
    // return days, hours, minutes and seconds to date passed
    $days = floor( $timeremaining/86400 );
    $timeremaining = $timeremaining - ( $days*86400 );
    $hours = floor( $timeremaining/3600 );
    $timeremaining = $timeremaining - ( $hours*3600 );
    $minutes = floor( $timeremaining/60 );
    $timeremaining = $timeremaining - ( $minutes*60 );
    $seconds = $timeremaining;
    //
    if ( $days == 0 ) {
        if ( $hours == 0 ) {
            if ( $minutes != 0 ) {
                if ( $minutes == 1 ) {
                    $timeRemainingString = $minutes.' minute, ';
                } else {
                    $timeRemainingString = $minutes.' minutes, ';
                }
            }
        } else {
            if ( $hours == 1 ) {
                $timeRemainingString = $hours.' hour, ';
            } else {
                $timeRemainingString = $hours.' hours, ';
            }
            if ( $minutes == 1 ) {
                $timeRemainingString .= $minutes.' minute, ';
            } else {
                $timeRemainingString .= $minutes.' minutes, ';
            }
        }
    } else {
        if ( $days == 1 ) {
            $timeRemainingString = $days.' day, ';
        } else {
            $timeRemainingString = $days.' days, ';
        }
        if ( $hours == 1 ) {
            $timeRemainingString .= $hours.' hour, ';
        } else {
            $timeRemainingString .= $hours.' hours, ';
        }
        if ( $minutes == 1 ) {
            $timeRemainingString .= $minutes.' minute, ';
        } else {
            $timeRemainingString .= $minutes.' minutes, ';
        }
    }
    if ( $seconds == 1 ) {
        $timeRemainingString .= $seconds.' second.';
    } else {
        $timeRemainingString .= $seconds.' seconds.';
    }
    return $timeRemainingString;
}
//
function formatCurrency( $totalamount ) {
    // convert silver to gold and silver
    $moneystring = "";
    $silver = $totalamount%100;
    $gold = ( $totalamount-$silver )/100;
    if ( $gold>0 ) {
        $moneystring = $gold." gold - ";
    }
    $moneystring .= $silver." silver";
    return $moneystring;
}
//
/*
function writeFlash( $Fwidth, $Fheight, $Fpath, $Faltimage, $Falttext, $Fobjectname ) {
    // write flash with noscript and call JS to avoid IE activex issues
    echo '<script type="text/javascript">'."\n";
    echo 'IEflash("'.$Fwidth.'","'.$Fheight.'","'.$Fpath.'","'.$Faltimage.'","'.$Falttext.'","'.$Fobjectname.'")'."\n";
    echo '</script>'."\n";
 
    echo '<noscript>'."\n";
    echo '<object type="application/x-shockwave-flash" data="'.$Fpath.'" width="'.$Fwidth.'" height="'.$Fheight.'" id="'.$Fobjectname.'" name="'.$Fobjectname.'">'."\n";
    echo '<param name="movie" value="'.$Fpath.'" />'."\n";
    echo '<param name="wmode" value="transparent" />'."\n";
    echo '<param name="quality" value="high" />'."\n";
    echo '<img src="'.$Faltimage.'" width="'.$Fwidth.'" height="'.$Fheight.'" alt="'.$Falttext.'">'."\n";
    echo '</object>'."\n";
    echo '</noscript>'."\n";
}
*/
//
/*
function validHexColour( $hexvalue ) {
    // regex to check valid hex values (could be 3 values eg. fff)
    // '#' has already been checked for and removed
    $match = ereg( '^([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$', $hexvalue );
    if ( $match == false ) {
        return false;
    } else {
        return true;
    }
}
*/
//
function cleanURL( $string ) {
 
 
 
    $string=trim( $string );
 
 
    // http://stackoverflow.com/questions/11330480/strip-php-variable-replace-white-spaces-with-dashes
    //Lower case everything
 
    $string = strtolower( $string );
 
// convert accent characters to non-accented equivilent:
$string = strtr($string, array('é' => 'e', 'è' => 'e'));
 
    //Make alphanumeric (removes all other characters)
    $string = preg_replace( "/[^a-z0-9_\s-]/", "", $string );
    //Clean up multiple dashes or whitespaces
    $string = preg_replace( "/[\s-]+/", " ", $string );
    //Convert whitespaces and underscore to dash
    $string = preg_replace( "/[\s_]/", "-", $string );

       // limit to 128 chars:
    $string = substr( $string, 0, 128 );
    return $string;
}
 
 
function displayAuctionItemsEndingSoon( $itemLimit ) {
    global $connection;
    $query = "SELECT tblauctionitems.*, tblinventoryitems.itemid, tblinventoryitems.shortname
    FROM tblauctionitems
    inner join tblinventoryitems on tblauctionitems.itemid = tblinventoryitems.itemid
    WHERE tblauctionitems.endtime > NOW()
    and tblauctionitems.auctionclosed = 'true'
    ORDER BY tblauctionitems.endtime ASC
    LIMIT ".$itemLimit;
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
 
 
        while ( $row = mysqli_fetch_array( $result ) ) {
            extract( $row );
            $endTime = strtotime( $endTime );
            $timeToEnd = $endTime-time();
            //
 
 
            // get the highest 2 bids from different bidders on this item:
 
            $query3 = "select tblauctionbids.auctionid ,tblauctionbids.bidderid, max(tblauctionbids.bidAmount) as bidAmount, tblcharacters.charname, tblcharacters.charid
 
from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderid = tblcharacters.charid
where auctionid = '".$auctionID."'
group by tblauctionbids.bidderid
order by tblauctionbids.bidamount DESC limit 2
            ";
 
            $result3 = mysqli_query($connection,  $query3 ) or die ( "couldn't execute query3" );
 
            $numberofrows3 = mysqli_num_rows( $result3 );
 
            switch ( $numberofrows3 ) {
            case 0:
                // no bids
                $currentprice = $startPrice;
                break;
            case 1:
                // get the one bidder's name:
                $row3 = mysqli_fetch_array( $result3 );
                extract( $row3 );
                $highbidder = $charname;
                $currentprice = $startPrice;
                break;
            case 2:
                // determine current bid:
                $row3 = mysqli_fetch_array( $result3 );
                extract( $row3 );
                $highbid = $bidAmount;
                $highbidder = $charname;
                $row3b = mysqli_fetch_array( $result3 );
                extract( $row3b );
                $secondhighbid = $bidAmount;
 
                if ( $highbid>( $secondhighbid+1 ) ) {
                    $currentprice = $secondhighbid+1;
                } else {
                    $currentprice = $highbid;
                }
                break;
            }
 
 
outputAuctionCard($itemID, $auctionID, $quantity, $shortname, $currentprice, $reservePrice, $buyItNowPrice, $timeToEnd);
        }
 
    } else {
        echo'<p>No items found for sale.</p>';
    }
 
 
}
 
 
 
function displayAuctionNewestItems( $itemLimit ) {
        global $connection;
    $query = "SELECT tblauctionitems.*, tblinventoryitems.itemid, tblinventoryitems.shortname
    FROM tblauctionitems
    inner join tblinventoryitems on tblauctionitems.itemid = tblinventoryitems.itemid
    WHERE tblauctionitems.endtime > NOW()
    and tblauctionitems.auctionclosed = 'true'
    ORDER BY tblauctionitems.starttime DESC
    LIMIT ".$itemLimit;
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
 
 
        while ( $row = mysqli_fetch_array( $result ) ) {
            extract( $row );
            $endTime = strtotime( $endTime );
            $timeToEnd = $endTime-time();
            //
 
 
            // get the highest 2 bids from different bidders on this item:
 
            $query3 = "select tblauctionbids.auctionid ,tblauctionbids.bidderid, max(tblauctionbids.bidamount) as bidAmount, tblcharacters.charname, tblcharacters.charid
 
from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderid = tblcharacters.charid
where auctionid = '".$auctionID."'
group by tblauctionbids.bidderid
order by tblauctionbids.bidamount DESC limit 2
            ";
 
            $result3 = mysqli_query($connection,  $query3 ) or die ( "couldn't execute query3" );
 
            $numberofrows3 = mysqli_num_rows( $result3 );
 
            switch ( $numberofrows3 ) {
            case 0:
                // no bids
                $currentprice = $startPrice;
                break;
            case 1:
                // get the one bidder's name:
                $row3 = mysqli_fetch_array( $result3 );
                extract( $row3 );
                $highbidder = $charname;
                $currentprice = $startPrice;
                break;
            case 2:
                // determine current bid:
                $row3 = mysqli_fetch_array( $result3 );
                extract( $row3 );
                $highbid = $bidAmount;
                $highbidder = $charname;
                $row3b = mysqli_fetch_array( $result3 );
                extract( $row3b );
                $secondhighbid = $bidAmount;
 
                if ( $highbid>( $secondhighbid+1 ) ) {
                    $currentprice = $secondhighbid+1;
                } else {
                    $currentprice = $highbid;
                }
                break;
            }
 
 
 
 
outputAuctionCard($itemID, $auctionID, $quantity, $shortname, $currentprice, $reservePrice, $buyItNowPrice, $timeToEnd);
        }
 
    } else {
        echo'<p>No items found for sale.</p>';
    }
 
 
}
 
 
 
 
function outputAuctionCard($itemID, $auctionID, $quantity, $shortname, $currentprice, $reservePrice, $buyItNowPrice, $timeToEnd) {
 
 
 
        echo '<div itemscope itemtype="http://schema.org/Product">';
 
echo '<img src="/images/game-world/inventory-items/'.$itemID.'.png" class="inventorySlot" itemprop="image" alt="'.$shortname.'">';
 
            echo'<p itemprop="name"><a href="/auction/ViewItem.php?item='.$auctionID.'" title="more information">'.$shortname.'</a></p>'."\n";
            echo'<p itemprop="offers" itemscope itemtype="http://schema.org/Offer">Current price: <span itemprop="price">'.formatCurrency( $currentprice ).'</span>';
if ( $buyItNowPrice != '-1' ) {
                echo'<br /><a href="#" title="Buy '.$shortname.' now!">Buy it now for <span itemprop="price">'.$buyItNowPrice.'</span></a>';
            }
            echo '</p>';
 
            if ( $reservePrice != "-1" ) {
                // check if reserve has been met:
                if ( $currentprice < $reservePrice ) {
                    echo ' - reserve not met';
                }
            }
 
            echo'<br />Ends in '.timeRemaining( $timeToEnd );
 
             
 
            echo'</div>'."\n";
}
 
 
 
function displayContractNewestItems( $itemLimit ) {
     global $connection;
    $query = "SELECT tblcontracts.*, tblinventoryitems.itemID, tbllocations.locName as startLocName, tbllocations.locName as LocName, tblinventoryitems.shortname
    FROM tblcontracts
    inner join tblinventoryitems on tblcontracts.itemid = tblinventoryitems.itemid
    inner join tbllocations on tbllocations.locID = tblcontracts.startLocation
    WHERE tblcontracts.contractEnd > NOW()
    ORDER BY tblcontracts.contractStart DESC
    LIMIT ".$itemLimit;
 
 
 
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
 
 
        while ( $row = mysqli_fetch_array( $result ) ) {
            extract( $row );
 
 
 
            $endTime = strtotime( $contractEnd );
            $timeToEnd = $endTime-time();
 
 
 
            echo'<div class="inventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
            echo'<a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" alt="'.$shortname.'"></a></div>'."\n";
            echo'<div class="Clearer">&nbsp;</div>'."\n";
            echo'<p><a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information">'.$shortname.'</a>'."\n";
 
            echo'<br />Ends in '.timeRemaining( $timeToEnd );
            echo'</p>'."\n";
 
 
 
 
 
 
 
 
 
 
 
            if ( $contractType == 1 ) {
                // transportation - get end location
                $query = "Select tblcontracts.*, tbllocations.locName as endLocName
FROM tblcontracts
    inner join tbllocations on tbllocations.locID = tblcontracts.endLocation
    where tblcontracts.contractID = '".$contractID."'
    ";
 
 
                $innerresult = mysqli_query($connection,  $query ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                }
 
 
                echo "<p>Transportation from ".$startLocName." to ".$endLocName."</p>";
 
 
                // transportation - get current lowest bid:
 
                $query3 = "select tblcontractbids.contractID, min(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID
order by tblcontractbids.bidAmount DESC limit 1
            ";
 
 
                $innerresult = mysqli_query($connection,  $query3 ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                    echo "<p>Current best offer: ".formatCurrency( $bidAmount )."</p>";
                } else {
                    echo "<p>No bids so far</p>";
                }
 
 
 
            } else {
                // want to buy
                echo "<p>wanted</p>";
 
 
                // want to buy - get current highest bid:
 
                $query3 = "select tblcontractbids.contractID, max(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID
order by tblcontractbids.bidAmount DESC limit 1
            ";
 
 
                $innerresult = mysqli_query($connection,  $query3 ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                    echo "<p>Current best offer: ".formatCurrency( $bidAmount )."</p>";
                } else {
                    echo "<p>No bids so far</p>";
                }
 
 
            }
 
 
        }
    }
 
 
}
 
 
function displayContractItemsEndingSoon( $itemLimit ) {
     global $connection;
    $query = "SELECT tblcontracts.*, tblinventoryitems.itemID, tbllocations.locName as startLocName, tbllocations.locName as LocName, tblinventoryitems.shortname
    FROM tblcontracts
    inner join tblinventoryitems on tblcontracts.itemid = tblinventoryitems.itemid
    inner join tbllocations on tbllocations.locID = tblcontracts.startLocation
    WHERE tblcontracts.contractEnd > NOW()
    ORDER BY tblcontracts.contractEnd ASC
    LIMIT ".$itemLimit;
 
 
 
 
 
 
 
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
 
 
        while ( $row = mysqli_fetch_array( $result ) ) {
            extract( $row );
 
 
 
            $endTime = strtotime( $contractEnd );
            $timeToEnd = $endTime-time();
 
 
 
            echo'<div class="inventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
            echo'<a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" alt="'.$shortname.'"></a></div>'."\n";
            echo'<div class="Clearer">&nbsp;</div>'."\n";
            echo'<p><a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information">'.$shortname.'</a>'."\n";
 
            echo'<br />Ends in '.timeRemaining( $timeToEnd );
            echo'</p>'."\n";
 
            if ( $contractType == 1 ) {
                // transportation - get end location
                $query = "Select tblcontracts.*, tbllocations.locName as endLocName
FROM tblcontracts
    inner join tbllocations on tbllocations.locID = tblcontracts.endLocation
    where tblcontracts.contractID = '".$contractID."'
    ";
 
 
                $innerresult = mysqli_query($connection,  $query ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                }
 
 
                echo "<p>Transportation from ".$startLocName." to ".$endLocName."</p>";
 
                // transportation - get current lowest bid:
 
                $query3 = "select tblcontractbids.contractID, min(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID
order by tblcontractbids.bidAmount DESC limit 1
            ";
 
 
                $innerresult = mysqli_query($connection,  $query3 ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                    echo "<p>Current best offer: ".formatCurrency( $bidAmount )."</p>";
                } else {
                    echo "<p>No bids so far</p>";
                }
 
            } else {
                // want to buy
                echo "<p>wanted</p>";
 
                // want to buy - get current highest bid:
 
                $query3 = "select tblcontractbids.contractID, max(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID
order by tblcontractbids.bidAmount DESC limit 1
            ";
 
 
                $innerresult = mysqli_query($connection,  $query3 ) or die ( "couldn't execute inner query" );
 
                $innernumberofrows = mysqli_num_rows( $innerresult );
                if ( $innernumberofrows>0 ) {
                    $innerrow = mysqli_fetch_array( $innerresult );
                    extract( $innerrow );
                    echo "<p>Current best offer: ".formatCurrency( $bidAmount )."</p>";
                } else {
                    echo "<p>No bids so far</p>";
                }
            }
 
 
        }
    }
 
 
}
 
 
function date_compare($a, $b) {
    http://stackoverflow.com/questions/2910611/php-sort-a-multidimensional-array-by-element-containing-date
    $t1 = strtotime($a['eventStart']);
    $t2 = strtotime($b['eventStart']);
    return $t1 - $t2;
}  
 
 
function displayUpcomingEvents( $limit ) {
 global $connection;
// http://stackoverflow.com/questions/5183630/calendar-recurring-repeating-events-best-storage-method#answer-16659802
 
     
    $query = "SELECT * from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) <= (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) <= (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays)))) order by eventstart ASC limit ".$limit;
     
 
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
?>
    <ul>
 
<?php
 
 
$eventData = [];
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
 
// get the correct years for repeating events:
if($row['repeatsAnnually'] > 0) {
$startDateDayAndMonth = date('j-n',strtotime($row['eventStart']));
$startDateYear = date('Y');
$row['eventStart'] = $startDateDayAndMonth."-".$startDateYear;
$row['eventEnd'] = strtotime($row['eventStart']) + ($row['eventDurationDays']*3600*24);
// is this event end still current if it was a year previously?
// (is previous year end of time after now)
$yearPreviousEndTime = strtotime("-1 year", $row['eventEnd']);

if($yearPreviousEndTime >= date(time())) {
// use the earlier date instead:
	$row['eventStart'] = $startDateDayAndMonth."-".($startDateYear-1);
	$row['eventEnd'] = $yearPreviousEndTime;
}
} else {
    // just work out the end time:
    $row['eventEnd'] = strtotime($row['eventStart']) + ($row['eventDurationDays']*3600*24);
}
 
 
 
 
 
    array_push($eventData, $row);
}
mysqli_free_result($result);
 
// sort by start date:
usort($eventData, 'date_compare');
 
        for ($j=0;$j<count($eventData);$j++) {
             
 
            // https://productforums.google.com/forum/#!topic/webmasters/hqXyipukFOg;context-place=forum/webmasters
 
 
 
 
 
            echo '<li itemscope itemtype="http://schema.org/Event"><a itemprop="url" href="/almanack/'.$eventData[$j]['cleanURL'].'/"><h6 itemprop="name">'.$eventData[$j]['title'].'</h6><p itemprop="description">'.$eventData[$j]['summary'].'</p>';
            $startDateOutput = date( 'j', strtotime( $eventData[$j]['eventStart'] ) )."<sup>".date( 'S', strtotime( $eventData[$j]['eventStart'] ) )."</sup> ".date( 'F Y', strtotime( $eventData[$j]['eventStart'] ) );
            $endDateOutput = date( 'j',  strtotime($eventData[$j]['eventEnd'])  )."<sup>".date( 'S',  $eventData[$j]['eventEnd']  )."</sup> ".date( 'F Y',  strtotime($eventData[$j]['eventEnd'])  );
            echo '<span>From <span itemprop="startDate" content="'.$eventData[$j]['eventStart'].'">'.$startDateOutput.'</span> to <span itemprop="endDate" content="'.$eventData[$j]['eventEnd'].'">'.$endDateOutput.'</span></span>';
            // echo '<span itemprop="location" itemscope itemtype="http://schema.org/Place"><span itemprop="url" href="'.$link.'">'.$link.'</span></span>';
            echo '</a></li>';
 
 
        }
        echo "</ul>";
    }
 
}
 
 
 
 
function displayDeepestDelvers() {
        global $connection;
    // get all dungeons:
    $query = "select * from tbldungeonmapconfig";
    $result = mysqli_query($connection,  $query ) or die ( "couldn't execute query" );
 
    $numberofrows = mysqli_num_rows( $result );
    if ( $numberofrows>0 ) {
 
?>
    <ul>
        <?php
 
        while ( $row = mysqli_fetch_array( $result ) ) {
            extract( $row );
 
            // get newest, deepest map for this map
            $innerQuery = "select tbldungeonachievements.mapReached as maxReached, tbldungeonachievements.timeStamp as timeStamp, tblcharacters.charName as charName
from tbldungeonachievements
inner join tblcharacters on tbldungeonachievements.charID = tblcharacters.charID
            where tbldungeonachievements.dungeonId='".$dungeonId."' order by tbldungeonachievements.mapReached DESC, tbldungeonachievements.timeStamp ASC limit 1";
 
            $innerresult = mysqli_query($connection,  $innerQuery ) or die ( "couldn't execute innerQuery" );
            $innernumberofrows = mysqli_num_rows( $innerresult );
            if ( $innernumberofrows>0 ) {
                while ( $innerrow = mysqli_fetch_array( $innerresult ) ) {
                    extract( $innerrow );
 
 
                    echo '<li>'.$dungeonName.': '.$charName." - level ".$maxReached.', '.relativePastDate( strtotime( $timeStamp ) ).'</li>';
 
                }
            }
 
 
        }
 
?>
    </ul>
        <?php
 
    }
 
 
}
 
 function relativeTime($time) {

        $reldays = ( $time )/86400;
    $relhours = ( $time )/3600;
    $relminutes = ( $time )/60;



if( $reldays > 0 ) {
    if  ( $relhours < 1 ) {
        return floor($relminutes) . " minutes";
        } else if  ( $reldays < 1 ) {
        return floor($relhours) . " hours";
    } else if ( $reldays < 2 ) {
            return 'Tomorrow';
        } else {
            $reldays = floor( $reldays );
            return $reldays . " days";
        } 
    }
 }
 
function relativeShortFutureDate($time) {
    $today = strtotime("now");
 
    $reldays = ( $time - $today )/86400;
    $relhours = ( $time - $today )/3600;
    $relminutes = ( $time - $today )/60;
if( $reldays > 0 ) {
if  ( $relhours < 1 ) {
return " (in ".floor($relminutes) . " minutes' time)";
        } else if  ( $reldays < 1 ) {
        return " (in ".floor($relhours) . " hours' time)";
    } else if ( $reldays < 2 ) {
            return ' (Tomorrow)';
        } else if ( ( $reldays ) < 7 ) {
            $reldays = floor( $reldays );
            return " (in ".$reldays . " days' time)";
        } 
    }
}
 
 
 
function relativePastDate( $time ) {
    $today = strtotime("now");
    $reldays = ( $today - $time )/86400;
 
    if ( $reldays < 1 ) {
        return 'Today';
    } else if ( $reldays < 2 ) {
            return 'Yesterday';
        } else if ( ( $reldays ) < 7 ) {
            $reldays = floor( $reldays );
            return $reldays . ' days ago';
        } else if ( abs( $reldays ) < 365 ) {
            return date( 'j',  $time  )."<sup>".date( 'S',  $time  )."</sup> ".date( 'F',  $time  );
        } else {
        return date( 'j',  $time  )."<sup>".date( 'S',  $time  )."</sup> ".date( 'F Y',  $time  );
    }
}
 
 
 
 
 
 
 
 
 
 
 
 
 
function createMagicSquare() {
    // https://en.wikipedia.org/wiki/Magic_square#Method_for_constructing_a_magic_square_of_order_3
 
 
// check if logged in:
    if(isset($_SESSION['username'])) {
 
// check current character has -1 for this, otherwise they've already seen it:
 
 
$magicSquareNumber = -1;
// get current character for this account:
$query = "select tblcharacters.404MagicSquareSum as magicSquareNumber, tblcharacters.charId as charID
from tblcharacters
inner join tblacct on tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
     
 
     
        $returned = mysqli_num_rows($result);
     
    if ($returned > 0) {
     
    $row = mysqli_fetch_array($result);
     
        extract($row); 
}
 
 
 
 
 
 
 
 
 
 
 
if($magicSquareNumber == -1) {
// if search for this number sends a mail with an item that starts a quest
 
 
do {
$a = rand(1,16);
$c = rand(32, 78);
$b = rand(($a+1), ($c-$a));
//  0 < a < b < c - a and b ≠ 2a
} while ($b == (2*$a));
 
$saveString = $a."|".$b."|".$c;
 
    $query = "UPDATE tblcharacters SET 404MagicSquareSum='".$saveString."' WHERE charId = '" . $charID . "'";
    $result = mysqli_query($connection, $query) or die ("couldn't execute query");
 
} else {
    $magicNumberSplits = explode("|", $magicSquareNumber);
    $a = $magicNumberSplits[0];
    $b = $magicNumberSplits[1];
    $c = $magicNumberSplits[2];
}
    ?>
    <div class="row">
    <p>Are you lost? Maybe this will help:</p>
    <table id="magicSquare">
        <tr>
            <?php
 
echo '<td>'.($c-$b).'</td><td>'.($c+$b+$a).'</td><td>'.($c-$a).'</td>';
?>
</tr><tr>
 
<?php
 
echo '<td>'.($c-$a+$b).'</td><td>'.($c).'</td><td>'.($c+$a-$b).'</td>';
?>
</tr><tr>
 
<?php
 
echo '<td>'.($c+$a).'</td><td>'.($c-$b-$a).'</td><td>'.($c+$b).'</td>';
?>
</tr></table></div>
<?php
}
 
}
 
 
 
 
 
// responsive images:
 
function imageResized($source, $widthRequired) {
    $resizedFolder = '/images/resized/'.$widthRequired;
    $lastSlash = strrpos($source,"/");
    $resizedPath = $resizedFolder.'/'.substr($source,$lastSlash+1);
    // check if it already exists, and use that if so:
    if(file_exists ( $_SERVER['DOCUMENT_ROOT'].$resizedPath )) {
        return $resizedPath;
    }
    $sourceDimensions = getimagesize($_SERVER['DOCUMENT_ROOT'].$source);
    $sourceWidth = $sourceDimensions[0];
    // check file extension:
    $dotPos = strrpos($source, ".");
    $fileExtension = substr(strtolower($source), $dotPos+1);
    if($widthRequired<$sourceWidth) {
        $sourceHeight = $sourceDimensions[1];
        $heightRequired = floor(($widthRequired*$sourceHeight)/$sourceWidth);
        $image = imagecreatetruecolor($widthRequired, $heightRequired);
        switch ($fileExtension) {
            case "jpg":
            $sourceImage = imagecreatefromjpeg($_SERVER['DOCUMENT_ROOT'].$source);
            break;
        case "png":
            $sourceImage = imagecreatefrompng($_SERVER['DOCUMENT_ROOT'].$source);
            imagealphablending( $image, false );
            imagesavealpha( $image, true );
            break;
        }
        imagecopyresampled($image, $sourceImage, 0, 0, 0, 0, $widthRequired, $heightRequired, $sourceWidth, $sourceHeight);
        // create folder if it doesn't exist
        if(!file_exists ( $_SERVER['DOCUMENT_ROOT'].$resizedFolder )) {
            mkdir($_SERVER['DOCUMENT_ROOT'].$resizedFolder);
        }
        switch ($fileExtension) {
        case "jpg":
            imagejpeg($image, $_SERVER['DOCUMENT_ROOT'].$resizedPath, 85);

            break;
        case "png":
            imagepng($image, $_SERVER['DOCUMENT_ROOT'].$resizedPath, 0);
            break;
        }
imagewebp($image, str_ireplace($fileExtension,'webp',$_SERVER['DOCUMENT_ROOT'].$resizedPath));
        imagedestroy($image);
        imagedestroy($sourceImage);
        return $resizedPath;
    } else {
    // use original:
    return $source;
    }
}
 
 
 
function picture($source, $alt, $breakpoints, $forceResize = false, $classOrProperty = '', &$addToBuffer = '') {
    global $fullSitePath;
    $dotPos = strrpos($source, ".");
    $fileExtension = substr(strtolower($source), $dotPos+1);
        $thisFileType = 'image/jpeg';
        if($fileExtension == 'png') {
$thisFileType = 'image/png';
        }
    $thisHtmlOutput = '<picture>';
    if(!$forceResize) {
        // don't use the original image size if true - use the picture element to force a resize of the image, and exclude the original
     //   $thisHtmlOutput .= '<source media="(min-width: '.$breakpoints[(count($breakpoints)-1)].'px)" srcset="'.str_ireplace($fileExtension,'webp',$source).'" type="image/webp">';
        $thisHtmlOutput .= '<source media="(min-width: '.$breakpoints[(count($breakpoints)-1)].'px)" srcset="'.$source.'" type="'.$thisFileType.'">';
        
    }

    for($i = count($breakpoints)-1; $i>=0;$i--) {
        
         $thisFilePath = imageResized($source,$breakpoints[$i]);
  // output webp:
          $thisHtmlOutput .= '<source ';
        if($i>0) {
            $thisHtmlOutput .= 'media="(min-width: '.$breakpoints[$i-1].'px)"';
        }
        $thisHtmlOutput .= ' srcset="'.str_ireplace($fileExtension,'webp',$thisFilePath).'" type="image/webp">';
         
        $thisHtmlOutput .= '<source ';
        if($i>0) {
            $thisHtmlOutput .= 'media="(min-width: '.$breakpoints[$i-1].'px)"';
        }
       
        $thisHtmlOutput .= ' srcset="'.$thisFilePath.'" type="'.$thisFileType.'">';
      
    }
    $thisHtmlOutput .= '<img src="'.$source.'" alt="'.$alt.'"'.$classOrProperty.'>';
    $thisHtmlOutput .= '</picture>';
    if($addToBuffer == '') {
        echo $thisHtmlOutput;
    } else {
        // if not echoing the results immediately - for ajax requests and so on:
        $addToBuffer .= $thisHtmlOutput;
    }
}
 
function responsiveBackground($source, $breakpoints, &$addToBuffer = '') {
    global $fullSitePath;
    // generate a unique id for this div
    $uniqueId = 'img'.uniqid();
    $thisHtmlOutput = '<style>#'.$uniqueId.'{';
    // get aspect ratio:
    $sourceDimensions = getimagesize($_SERVER['DOCUMENT_ROOT'].$source);
    $sourceWidth = $sourceDimensions[0];
    $sourceHeight = $sourceDimensions[1];
    $aspectRatio = $sourceHeight/$sourceWidth*100;
    $thisHtmlOutput .= 'padding-bottom:'.round($aspectRatio,2).'%;}';
    //  $thisHtmlOutput .= 'background-image:url('.$fullSitePath.$source.');';
    for($i=count($breakpoints)-1; $i>=0; $i--) {
        $thisHtmlOutput .= '@media (max-width: '.$breakpoints[$i].'px) { #'.$uniqueId.'{ background-image:url('.$fullSitePath.imageResized($source,$breakpoints[$i]).');}}';
    }
    $thisHtmlOutput .= '@media (min-width: '.(intval($breakpoints[count($breakpoints)-1])+1).'px) { #'.$uniqueId.'{ background-image:url('.$fullSitePath.$source.');}}';
    $thisHtmlOutput .= '</style><div id="'.$uniqueId.'" class="responsiveBG"></div>';
    if($addToBuffer == '') {
        echo $thisHtmlOutput;
    } else {
        // if not echoing the results immediately - for ajax requests and so on:
        $addToBuffer .= $thisHtmlOutput;
    }
}
 
 
function compress($string) {
    // thanks http://stackoverflow.com/questions/5815755/how-to-minify-html-code#answer-18418406
    // Remove html comments
    $string = preg_replace('/<!--.*-->/', '', $string);
 
    // Merge multiple spaces into one space
    $string = preg_replace('/\s+/', ' ', $string);   
 
    // Remove space between tags.
    // altered to collapse to a single space:
    return preg_replace('/>\s+</', '> <', $string); 
 
 
 
}
 
 
function sortSequentialSyllables($syllables) {
    // take an array of syllables and return and key array that lists every syllable with the syllables that can follow it
    // useful for procedurally creating names
    $i = 0;
    $orderedSyllables = array();
    do {
        if($syllables[$i] != " ") {
            if (array_key_exists($syllables[$i], $orderedSyllables)) {
                array_push($orderedSyllables[($syllables[$i])],$syllables[($i+1)]);
            } else {
                $orderedSyllables[$syllables[$i]] = array($syllables[($i+1)]);
            }
        }
        $i++;
    } while ($i < count($syllables));
    return $orderedSyllables;
}
 
function selectSyllables($possibleSyllables,$minSyllables,$maxSyllables) {
$numberOfSyllablesAvailable = count($possibleSyllables);
do {
    $syllableCount = 0;
    // pick a random start syllable:

    $arrayKeys = array_keys($possibleSyllables);
    $firstWord = $arrayKeys[mt_rand(0,count($arrayKeys)-1)];


   
    $constructedWord = $firstWord;
    //echo $firstWord . " - ";
    do {
        $nextSyllable = $possibleSyllables[$firstWord][mt_rand(0,count($possibleSyllables[$firstWord])-1)];
        //echo $nextSyllable . " - ";
        $constructedWord .= $nextSyllable;
        $firstWord = $nextSyllable;
        $syllableCount ++;
    } while ($nextSyllable != " ");
    //echo " ** ";
} while (!(($syllableCount>=$minSyllables) && ($syllableCount<=$maxSyllables)));
return $constructedWord;
}
 
 
 
 
 
 
 
function buildBreadCrumb($breadcrumbPath,$breadcrumbNames = "") {
    // $breadcrumbPath is the full path split by /
    // $breadcrumbNames will override any text to display - otherwise the url will be used. Split by /. 
    $pathSplit = explode("/", $breadcrumbPath);
    $nameSplit = explode("/", $breadcrumbNames);
    $htmlOutput = '<ul class="breadcrumbs" vocab="http://schema.org/" typeof="BreadcrumbList">';
    $pathBuiltSoFar = '/';
    for ($i=0; $i<count($pathSplit);$i++) {
 
$htmlOutput .= '<li property="itemListElement" typeof="ListItem">';
$pathBuiltSoFar .= $pathSplit[$i].'/';
// display the url:
$thisName = ucfirst($pathSplit[$i]);
if(isset($nameSplit[$i])) {
    if($nameSplit[$i] != "") {
    // use the text passed instead
$thisName = $nameSplit[$i];
}
}
$htmlOutput .= '<a property="item" typeof="WebPage" href="'.$pathBuiltSoFar.'"><span property="name">'.$thisName.'</span></a>';
$htmlOutput .= '<meta property="position" content="'.($i+1).'">';
$htmlOutput .= '</li>';
 
 
    }
    $htmlOutput .= '</ul>';
    return $htmlOutput;
}
 
 
 
 
 
function findAndReplaceHashes($stringToCheck, &$json='') {
    global $entriesAlreadyUsed;
    if(!isset($entriesAlreadyUsed)) {
        $entriesAlreadyUsed = [];
    }
    if ($json == '') {
    global $json;
}
    // check for any '#'s:
    $hashSplit = explode("#", $stringToCheck);
    if(count($hashSplit) > 1) {
        for ($i=0;$i<count($hashSplit);$i++) {
            if(substr($hashSplit[$i],0,1) == "|") {
                $needsToBeUnique = false;
                // look for matching keys
                $keyToMatch = substr($hashSplit[$i],1);
                // a * denotes that this needs to unique and not repeated:
                if(strrpos($keyToMatch, "*") !== false) {
                    $needsToBeUnique = true;
$keyToMatch = str_replace("*", "", $keyToMatch);
                }
                
                if (array_key_exists($keyToMatch, $json)) {

if($needsToBeUnique) {
    // see if this key has already been used:
    do {
  $whichReplaceElem = mt_rand(0,(count($json[$keyToMatch])-1));
    $replacementString = $json[$keyToMatch][$whichReplaceElem];
    } while (in_array($replacementString, $entriesAlreadyUsed));
} else {
    // just get a random entry:
    $whichReplaceElem = mt_rand(0,(count($json[$keyToMatch])-1));
    $replacementString = $json[$keyToMatch][$whichReplaceElem];
}

 array_push($entriesAlreadyUsed, $replacementString);

                    
                    
                    // check this substitution string to see if it has any hashes itself:

                    $replacementString = findAndReplaceHashes($replacementString); 
                    $hashSplit[$i] = $replacementString;
                   
                }
            }
        }
        // put it back together:
        $stringToCheck = implode("", $hashSplit); 
    }
    return $stringToCheck;  
}
 
 
 
 
function parseMoney($amount) {
     $moneyOutput = "";
     $copper = $amount % 100;
     $gold = floor($amount / 10000);
     $silver = floor(($amount - $gold * 10000) / 100);
    if ($gold > 0) {
        $moneyOutput = $gold . '<span class="gold"></span>';
    }
    if (($silver > 0) || ($gold > 0)) {
        $moneyOutput .= $silver . '<span class="silver"></span>';
    }
     
        $moneyOutput .= $copper . '<span class="copper"></span>';
     
    return $moneyOutput;
}
 
 
 









function ampify($html) {
// # Replace img, audio, and video elements with AMP custom elements
// https://gist.github.com/adactio/73f404568bf5e0d000a6
// # Licensed under a CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// # http://creativecommons.org/publicdomain/zero/1.0/
    
    $html = str_ireplace(
        ['<img','<video','/video>','<audio','/audio>'],
        ['<amp-img','<amp-video','/amp-video>','<amp-audio','/amp-audio>'],
        $html
    );
    // # Add closing tags to amp-img custom element
    $html = preg_replace('/<amp-img(.*?)>/', '<amp-img$1></amp-img>',$html);
    // # Whitelist of HTML tags allowed by AMP
    $html = strip_tags($html,'<h1><h2><h3><h4><h5><h6><a><p><ul><ol><li><blockquote><q><cite><ins><del><strong><em><code><pre><svg><table><thead><tbody><tfoot><th><tr><td><dl><dt><dd><article><section><header><footer><aside><figure><time><abbr><div><span><hr><small><br><amp-img><amp-audio><amp-video><amp-ad><amp-anim><amp-carousel><amp-fit-rext><amp-image-lightbox><amp-instagram><amp-lightbox><amp-twitter><amp-youtube>');
    return $html;
}




function findWorldMapPosition($requiredMapNumber) {
    global $worldMap;
    // find where the required map is in the array:
    for ($i = 0; $i < count($worldMap[0]); $i++) {
        for ($j = 0; $j < count($worldMap); $j++) {
            if ($worldMap[$j][$i] == $requiredMapNumber) {
                $currentMapIndexX = $i;
                $currentMapIndexY = $j;
                break;
            }
        }
    }
    return [$currentMapIndexX, $currentMapIndexY];
}




function generateTreasureMap() {
    global $worldMap, $chr, $activeEvents, $worldMapTileLength;
  
// pick a random overworld map:
    $randomRow = $worldMap[array_rand($worldMap)];
    $randomMap = $randomRow[array_rand($randomRow)];
$randomMapDataFile = file_get_contents('../data/chr' .  $chr . '/map' . $randomMap . '.json');
$randomMapData = json_decode($randomMapDataFile, true);

  // find a clear location on this map:






// code duplicated from Resource placement - could be moved into a function? #####
   // make sure not blocked by item, static npcs, or active  items or npcs:
    $clearTiles = $randomMapData['map']['collisions'];
    // loop through items and mark those tiles:
    for($i=0;$i<count($randomMapData['map']['items']); $i++) {
        $clearTiles[($randomMapData['map']['items'][$i]['tileY'])][($randomMapData['map']['items'][$i]['tileX'])] = '1';
    }
    // loop through and mark any static NPCs:
    for($i=0;$i<count($randomMapData['map']['npcs']); $i++) {
        if ($randomMapData['map']['npcs'][$i]['movement'][0] == '-') {
            if ($randomMapData['map']['npcs'][$i]['isCollidable']) {
                $clearTiles[($randomMapData['map']['npcs'][$i]['tileY'])][($randomMapData['map']['npcs'][$i]['tileX'])] = '1';
            }
        }
    }
    // check seasonal content as well:
    for ($j=0;$j<count($activeEvents);$j++) {
        if(isset($randomMapData['map']['eventSpecificContent'][($activeEvents[$j])])) {
            $thisEvent = $randomMapData['map']['eventSpecificContent'][($activeEvents[$j])];

            if(isset($thisEvent['hiddenResourceCategories'])) {
                array_push($whichCategories, $thisEvent['hiddenResourceCategories']);
            }

            if(isset($thisEvent['items'])) {
                for($i=0;$i<count($thisEvent['items']); $i++) {
                    $clearTiles[($thisEvent['items'][$i]['tileY'])][($thisEvent['items'][$i]['tileX'])] = '1';
                }
            }

            if(isset($thisEvent['npcs'])) {
                for($i=0;$i<count($thisEvent['npcs']); $i++) {
                    if ($thisEvent['npcs'][$i]['movement'][0] == '-') {
                        if ($thisEvent['npcs'][$i]['isCollidable']) {
                            $clearTiles[($thisEvent['npcs'][$i]['tileY'])][($thisEvent['npcs'][$i]['tileX'])] = '1';
                        }
                    }
                }
            }
        }
    }
$mapTilesY = count($randomMapData['map']['terrain']);
$mapTilesX = count($randomMapData['map']['terrain'][0]);
// loop through clearTiles (inset from the edge by 1 though) and any that are blocked, mark the tiles immediately adjacent (N, E, S and W) as blocked as well, to allow space for the resource to be spawned
// ie. 'clear' tiles are themselves and their ordinal neighbours clear:
for ($i = 1; $i < $mapTilesX-1; $i++) {
            for ( $j = 1; $j < $mapTilesY-1; $j++) {
                if ($clearTiles[$j][$i] == "1") {
                    // don't mark these as '1' otherwise it will then block their neighbours as well:
                    $clearTiles[$j-1][$i] = "2";
                    $clearTiles[$j+1][$i] = "2";
                    $clearTiles[$j][$i+1] = "2";
                    $clearTiles[$j][$i-1] = "2";
                    }
                }
           }
for ($i = 1; $i < $mapTilesX-1; $i++) {
            for ( $j = 1; $j < $mapTilesY-1; $j++) {
         if ($clearTiles[$j][$i] == "2") {
$clearTiles[$j][$i] = "1";
         }

// save a fallback clear spot:
          if ($clearTiles[$j][$i] == "0") {
$fallBackThisX = $i;
$fallBackThisY = $j;
          }

            }
        }





// try and find a more random spot:
$foundAClearSpot = false;
$foundNumberOfAttempts = 30;

do {
$thisX = mt_rand(0,$mapTilesX-1);
        $thisY = mt_rand(0,$mapTilesY-1);
        if($clearTiles[$thisY][$thisX] == '0') {
            $foundAClearSpot = true;
        }
        $foundNumberOfAttempts --;
} while (($foundAClearSpot == false) && ($foundNumberOfAttempts>0));

if(!$foundAClearSpot) {
   $thisX = $fallBackThisX;
   $thisY = $fallBackThisY;
} 

// convert that to global coordinates:

$mapPosition = findWorldMapPosition($randomMap);


$globalPosX = $thisX + ($worldMapTileLength * $mapPosition[0]);
$globalPosY = $thisY + ($worldMapTileLength * $mapPosition[1]);

return $globalPosX."_".$globalPosY; 

    
}






function createCatalogueMarkup($allIdsRequired, $catalogueName, $shouldShowImmediately) {
    global $connection;
   

    $itemIdString = implode(", ", $allIdsRequired);
     // convert negatives to positives for thw query:
    $allPositiveIds = str_replace("-", "", $itemIdString);
$itemQuery = "SELECT * from tblinventoryitems where itemID in (".$allPositiveIds.")";

$itemResult = mysqli_query($connection,  $itemQuery ) or die ( "couldn't execute item query: ".$itemQuery );
$numberofrows = mysqli_num_rows( $itemResult );
$outputMarkup = '';
if ( $numberofrows>0 ) {
    $additionalClass = '';
    if($shouldShowImmediately) {
        $additionalClass = ' active';
    }
    $outputMarkup = '<div class="catalogue'.$additionalClass.'" id="catalogue'.$catalogueName.'"><div class="draggableBar">'.ucfirst(str_replace("-", " ", $catalogueName)).' catalogue</div><button class="closePanel">close</button><ul>';
    while ( $row = mysqli_fetch_array( $itemResult ) ) {
extract($row);


$isCompleteClass = '';
// if the id passed in is negative, then this is complete:
$negativeId = 0-$itemID;
if (in_array($negativeId, $allIdsRequired)) {
    $isCompleteClass = ' class="complete"';
    }

 $outputMarkup .= '<li'.$isCompleteClass.' data-id="'.$itemID.'">'.$shortname.'</li>';

    }
    $outputMarkup .= '</ul></div>';
}
mysqli_free_result($itemResult);
return $outputMarkup;
}














 
?>