-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2015 at 02:29 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `autumnearth`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblacct`
--

CREATE TABLE IF NOT EXISTS `tblacct` (
  `accountID` int(11) NOT NULL,
  `accountName` varchar(25) DEFAULT NULL,
  `accountStatus` char(1) DEFAULT NULL,
  `joinedTime` datetime DEFAULT NULL,
  `accountType` char(1) DEFAULT NULL,
  `postCount` int(11) DEFAULT NULL,
  `currentCharID` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `subscribeNews` char(1) DEFAULT NULL,
  `subscribeUpdates` char(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `htmlemail` char(1) DEFAULT NULL,
  `emailalerts` char(1) DEFAULT NULL,
  `uniqueID` varchar(255) DEFAULT NULL,
  `usersIPAddress` varchar(15) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblacct`
--

INSERT INTO `tblacct` (`accountID`, `accountName`, `accountStatus`, `joinedTime`, `accountType`, `postCount`, `currentCharID`, `email`, `birthday`, `subscribeNews`, `subscribeUpdates`, `password`, `signature`, `htmlemail`, `emailalerts`, `uniqueID`, `usersIPAddress`) VALUES
(5, 'seawarrior', '2', '2006-07-06 21:49:41', '0', 89, 1, 'john@salmacis.co.uk', '2006-07-29 18:16:14', '1', '1', 'ý¨âù­D;ùÉ“>hpTéÛ', '[u]warrior[/u] from the sea :)', '1', '1', '49a3805132045cc65b4b5ab43568fd2f', NULL),
(13, 'Administrator', '2', '2006-07-08 11:59:34', '2', 55, 5, 'john@salmacis.co.uk', '1974-12-24 00:00:00', '1', '1', 'w·J.>JguZE˜pw', 'admin signature', '1', '1', 'c91c757f11984bffdaa8e134a02670d1', NULL),
(14, 'Moderator', '2', '2006-07-08 12:00:21', '1', 16, 7, 'john@salmacis.co.uk', '2006-01-01 00:00:00', '1', '1', '“^º«—‘î…ƒ‚Xß¹)/', 'mod signature', '1', '1', 'e62499bfb61e356017ad99fc2d29eb65', NULL),
(15, 'john', '2', '2006-07-08 12:05:35', '0', 0, 1, 'john@salmacis.co.uk', '2006-01-01 00:00:00', '1', '1', '´ÉQÓ¾b@Ü¡¨w¦’,I', 'curiouser and curiouser', '1', '1', '03a94b7efb020da1caa0c5766c5b55bd', NULL),
(18, 'newmember', '2', '2006-07-13 07:44:14', '0', 7, 1, 'john@salmacis.co.uk', '1990-07-05 00:00:00', '1', '1', 'xb{lú`r^×>ë?îC', '10 people understand binary', '1', '1', 'a8a5b0f52af29a6b828f72201d63dda7', NULL),
(23, 'Stanley', '2', '2006-07-31 21:13:43', '0', 0, 4, 'john@salmacis.co.uk', '2001-08-15 00:00:00', '0', '1', '¾$Ð`ßðŠ‰Ò(!e', 'king of sleeping', '1', '1', '26fe209ceeaa3a61f55bfe79c45de96f', NULL),
(24, 'Angel', '2', '2006-07-31 22:33:33', '0', 0, 1, 'john@salmacis.co.uk', '2006-01-01 00:00:00', '1', '1', '9±(¸Áò©ŒR‚ð»\rÞ', '------', '0', '1', '6b4919695daf5c7f66601ff24b5310ed', NULL),
(25, '****wit', '2', '2006-08-07 22:35:16', '0', 0, 1, 'john@salmacis.co.uk', '2006-01-01 00:00:00', '1', '1', '!:Z¸Q4ÍNVÈ’4$F', 'i tried... :(', '0', '1', '384d845fa6a1f05c120c62bbd5f3582e', NULL),
(27, 'email checker', '2', '2007-02-21 08:47:34', '0', 0, 1, 'john@salmacis.co.uk', '2007-01-01 00:00:00', '1', '1', '‰Ž.>yÖ	’½9³W-’', '', '1', '1', 'fb3507f2f13101f846fa798313702ac3', NULL),
(28, 'testingIP', '2', '2007-05-09 12:13:30', '0', 0, 1, 'john@metafocus.co.uk', '2007-07-01 00:00:00', '1', '1', '*-¥÷*±\Zï`L!ï6', '----', '1', '1', '20fb6d0cb57fc10c5c1df41ed85a71d8', '212.135.231.210'),
(30, 'sheep', '2', '2007-07-21 15:35:16', '0', 0, 3, 'john@salmacis.co.uk', '2007-01-01 00:00:00', '1', '1', 'œŠhº€Ív£?iõšú‹ë', '---', '1', '1', '51277f189c5d244c2749d1915b28b80a', '88.104.225.176'),
(31, 'testingip#2', '2', '2007-07-23 18:23:22', '0', 0, 1, 'john@wibble.com', '2007-01-01 00:00:00', '1', '1', 'f,cÖÔ}<ÝÈz~aúdu', '', '1', '1', '497603502b525059ae6b201a7e86b2d0', '88.104.225.176'),
(32, 'eleaddai', '2', '2015-06-25 12:54:27', '0', 0, 1, 'john.holtripley@gmail.com', '1974-12-24 00:00:00', '1', '1', 'ŸÎ×2ëëÅ²4Ó®ßl«', 'wheeeee', '1', '1', 'cf6bd80435f39ce45412cae2277b5de0', '127.0.0.1'),
(33, 'johnnnn', '2', '2015-06-26 13:31:41', '0', 0, 1, 'john.holtripley@gmail.com', '1985-12-04 00:00:00', '1', '1', 'çêíƒj¦1‚ÇÁ(ˆÐÿ', 'hi', '1', '1', '252fe217036bf28bc4c8756e453fb548', '127.0.0.1'),
(34, 'johnnnnnnn', '2', '2015-06-26 13:35:42', '0', 0, 1, 'john.holtripley@googlemail.com', '1967-12-13 00:00:00', '1', '1', 'çêíƒj¦1‚ÇÁ(ˆÐÿ', 'hello', '1', '1', '2aac7823b50ded6afdbd16803861ae48', '127.0.0.1'),
(35, 'dillymeow', '2', '2015-06-26 13:45:29', '0', 0, 1, 'john.holtripley@gmail.com', '2005-05-04 00:00:00', '1', '1', 'n', 'meow', '1', '1', '59f91f97dfae8a6965f0443bc4709265', '127.0.0.1'),
(36, 'dilly', '2', '2015-06-26 13:47:48', '0', 0, 1, 'john.holtripley@gmail.com', '2001-05-06 00:00:00', '1', '1', 'F', 'meowmeow', '1', '1', 'ee3645262904c31781e14a223ca94eef', '127.0.0.1'),
(37, 'dilly2', '2', '2015-06-26 13:48:43', '0', 0, 1, 'john.holtripley@gmail.com', '2003-08-05 00:00:00', '1', '1', '', 'fgf ', '1', '1', 'f8a8d8c8d229b2fb3e670e2335c024ff', '127.0.0.1'),
(38, 'dilly3', '2', '2015-06-26 13:49:44', '0', 0, 1, 'john.holtripley@gmail.com', '2002-08-08 00:00:00', '1', '1', '', 'meowmeowmeow', '1', '1', '96691fd1228ccac76e92a51376410290', '127.0.0.1'),
(39, 'dilly4', '2', '2015-06-30 12:16:37', '0', 2, 14, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'F', 'dilly''s sig', '1', '1', '9c8fe4a786a619ae2a79f8e7a30b0903', '127.0.0.1'),
(40, 'dilly5', '2', '2015-07-01 12:49:57', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'F', 'hi', '1', '1', 'c10714bb83b8f9e435846ca4d7f4de5a', '127.0.0.1'),
(41, 'dilly6', '2', '2015-07-01 12:52:56', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'dd', '1', '1', 'cc795b52a79da76c0ec6c2fb8a47139f', '127.0.0.1'),
(42, 'dilly7', '2', '2015-07-01 12:56:40', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'q\r', 'dfd ', '1', '1', '5c06003a835996f6e991ba9c9d07f213', '127.0.0.1'),
(43, 'dilly8', '2', '2015-07-01 12:57:46', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'dfg dfg', '1', '1', '73f6a7e241495b62ef7837d896920f71', '127.0.0.1'),
(44, 'dilly9', '2', '2015-07-01 12:58:53', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'fdg df', '1', '1', '5f5fc9793149b4e2fbd5890bde7e4255', '127.0.0.1'),
(45, 'dilly10', '2', '2015-07-01 13:03:34', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'sad', '1', '1', '53f84406edc486c2ecfba47066b306a7', '127.0.0.1'),
(46, 'dilly11', '2', '2015-07-01 13:07:28', '0', 0, 1, 'john.holtripley@gmail.com', '2001-05-01 00:00:00', '1', '1', 'nÝ|•ÇG©”ª !²n‹*', 'ddd sdas das dsad ', '1', '1', '1bf279b495f3db4e193db87bc53fcd60', '127.0.0.1'),
(47, 'dilly12', '2', '2015-07-01 13:10:38', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '`ézz[£WÝu\raôÝ§', 'dilly12', '1', '1', '0b6ad46b1589a181e0402562c0b1d9e1', '127.0.0.1'),
(48, 'dilly20', '2', '2015-07-03 14:02:41', '0', 1, 15, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'ÞÉ/ê;}6Ôx|Ökd', 'dilly20', '1', '1', '3dcbb605f6e3545f33d0e1fe54042f97', '127.0.0.1'),
(49, 'dilly21', '2', '2015-07-03 14:03:09', '0', 0, 16, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'œé+''ÍÍiffA`jÔ@', 'dilly21', '1', '1', '55561f21c5445a16e9e306fae400b08c', '127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `tblauctionbids`
--

CREATE TABLE IF NOT EXISTS `tblauctionbids` (
  `bidID` int(11) NOT NULL,
  `auctionID` int(11) DEFAULT NULL,
  `bidderID` int(11) DEFAULT NULL,
  `bidAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblauctionbids`
--

INSERT INTO `tblauctionbids` (`bidID`, `auctionID`, `bidderID`, `bidAmount`) VALUES
(1, 4, 13, 6),
(2, 4, 12, 16),
(3, 4, 8, 24),
(4, 4, 13, 154),
(5, 4, 13, 230),
(6, 4, 7, 2300),
(7, 4, 7, 240),
(8, 4, 7, 600),
(9, 4, 7, 2500),
(10, 4, 5, 3000),
(11, 4, 5, 3500),
(12, 4, 4, 5000),
(13, 4, 4, 7000),
(14, 4, 4, 7200),
(15, 4, 4, 7800),
(16, 4, 4, 8400),
(17, 4, 4, 9000),
(18, 4, 4, 12003),
(19, 4, 4, 14507),
(20, 1, 1, 100);

-- --------------------------------------------------------

--
-- Table structure for table `tblauctionitems`
--

CREATE TABLE IF NOT EXISTS `tblauctionitems` (
  `auctionID` int(11) NOT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `sellerID` int(11) DEFAULT NULL,
  `itemID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `buyItNowPrice` int(11) DEFAULT NULL,
  `reservePrice` int(11) DEFAULT NULL,
  `startPrice` int(11) DEFAULT NULL,
  `auctionClosed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblauctionitems`
--

INSERT INTO `tblauctionitems` (`auctionID`, `startTime`, `endTime`, `sellerID`, `itemID`, `quantity`, `buyItNowPrice`, `reservePrice`, `startPrice`, `auctionClosed`) VALUES
(1, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 13, 6, 4, -1, -1, 20, 0),
(2, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 5, 24, 10, 100, -1, 20, 0),
(3, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 13, 24, 2, -1, 45, 20, 0),
(4, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 2, 2, 10, -1, -1, 20, 0),
(5, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 5, 6, 1, 10, -1, 20, 0),
(6, '2007-10-18 21:08:58', '2016-10-28 21:08:58', 13, 13, 6, -1, -1, 20, 0),
(7, '2007-10-18 21:08:58', '2016-10-28 21:08:58', 13, 13, 6, -1, -1, 20, 0),
(8, '2007-10-18 21:08:58', '2016-10-28 21:08:58', 13, 6, 4, -1, -1, 20, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblcharacters`
--

CREATE TABLE IF NOT EXISTS `tblcharacters` (
  `charID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `charName` varchar(25) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `gamestate` longtext,
  `journalstate` longtext,
  `queststate` longtext,
  `petstate` longtext,
  `currentbag` varchar(4) DEFAULT NULL,
  `inventorystate` longtext,
  `money` varchar(12) DEFAULT NULL,
  `house` int(11) NOT NULL DEFAULT '0',
  `minutesplayed` int(11) unsigned DEFAULT NULL,
  `guildID` int(11) DEFAULT '0',
  `guildmembersince` date DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcharacters`
--

INSERT INTO `tblcharacters` (`charID`, `accountID`, `charName`, `location`, `gamestate`, `journalstate`, `queststate`, `petstate`, `currentbag`, `inventorystate`, `money`, `house`, `minutesplayed`, `guildID`, `guildmembersince`) VALUES
(1, 5, 'Angel', 'Sundown Hills', '&amp;playsounds=true&amp;herox=23&amp;heroy=9&amp;dowseskill=0&amp;famskill=70&amp;currentmapnumber=1&amp;heightgained=0', 'travel to the coast', '0/0/0/0/0/0', '2,0,100,24,7,-1,0,0,0,0,pet,15,12,13', '16', '32,4/2,8/9,1/1,2/10,3/33,1', '299', 0, 1125, 0, '2007-03-30'),
(2, 5, 'Eleaddai', 'Stormwind', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(3, 5, 'Alice', 'Dustirnne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(4, 23, 'Eric', 'Crown Valley', NULL, NULL, NULL, NULL, NULL, NULL, '501', 0, 200, 0, '2007-03-30'),
(5, 13, 'Adminchar1', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, '0', 0, 200, 0, '2007-03-30'),
(6, 13, 'Adminchar2', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, '20', 0, 200, 0, '2007-03-30'),
(7, 14, 'modchar1', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(8, 14, 'modchar2', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(9, 15, 'johnchar1', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(10, 18, 'newmemberchar1', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(11, 18, 'newmemberchar2', 'Sundown Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(12, 13, 'Angel', 'Sunduun Hills', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(13, 14, 'Angel', 'Somewhere else', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2007-03-30'),
(14, 39, 'eleaddaiMeow', 'the garden', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2015-06-30'),
(15, 39, 'dilly20', 'the garden', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2015-06-30'),
(16, 39, 'dilly21', 'the garden', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 0, '2015-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `tblevents`
--

CREATE TABLE IF NOT EXISTS `tblevents` (
  `eventID` int(11) NOT NULL,
  `eventStart` datetime DEFAULT NULL,
  `eventEnd` datetime DEFAULT NULL,
  `tooltip` varchar(255) DEFAULT NULL,
  `css` varchar(25) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblevents`
--

INSERT INTO `tblevents` (`eventID`, `eventStart`, `eventEnd`, `tooltip`, `css`, `link`) VALUES
(1, '2006-08-27 00:00:00', '2006-09-01 00:00:00', 'halloween events part4', 'CHalloween', '/events/index.php#4'),
(2, '2006-08-03 00:00:00', '2006-08-08 00:00:00', 'halloween events part1', 'CHalloween', '/events/index.php#1'),
(3, '2006-08-12 00:00:00', '2006-08-12 00:00:00', 'halloween events part2', 'CHalloween', '/events/index.php#2'),
(4, '2006-07-12 00:00:00', '2006-08-01 00:00:00', 'halloween events part3', 'CHalloween', '/events/index.php#3'),
(5, '2015-12-21 00:00:00', '2015-12-25 00:00:00', 'Christmas', 'CHalloween', '/events/index.php#5');

-- --------------------------------------------------------

--
-- Table structure for table `tblforums`
--

CREATE TABLE IF NOT EXISTS `tblforums` (
  `forumID` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` mediumtext,
  `imagePath` varchar(255) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblforums`
--

INSERT INTO `tblforums` (`forumID`, `title`, `description`, `imagePath`, `status`, `sticky`) VALUES
(1, 'Bug Reports', 'Found a bug? Let us know about it here.', '/assets/forum/bugforum.gif', '2', '1'),
(2, 'Suggestions', 'Thought of an improvement? Let us know what features you''d like to see in the next update.', '/assets/forum/suggestforum.gif', '2', '1'),
(3, 'General Discussion', 'Want to meet other players? find and chat to them here.', '/assets/forum/generalforum.gif', '2', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tblfreeformpages`
--

CREATE TABLE IF NOT EXISTS `tblfreeformpages` (
  `pageID` int(11) NOT NULL,
  `status` char(1) DEFAULT NULL,
  `pageContent` longtext,
  `textColour` varchar(6) DEFAULT '000000',
  `bgColour` varchar(6) DEFAULT 'ffffff',
  `freeformPageTitle` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `guildID` int(11) DEFAULT NULL,
  `public` char(1) DEFAULT '1',
  `creationTime` datetime NOT NULL,
  `fontfamily` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblfreeformpages`
--

INSERT INTO `tblfreeformpages` (`pageID`, `status`, `pageContent`, `textColour`, `bgColour`, `freeformPageTitle`, `cleanURL`, `guildID`, `public`, `creationTime`, `fontfamily`) VALUES
(1, '1', '&lt;P&gt;stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'guild page #1', 'guild-page-1', 1, '1', '2006-07-23 00:00:00', 'Georgia, ''Times New Roman'', Times, serif'),
(2, '1', '&lt;P&gt;second stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'guild page #2', 'guild-page-2', 1, '1', '2006-07-23 00:00:00', 'Georgia, ''Times New Roman'', Times, serif'),
(3, '1', '&lt;P&gt;earthen stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'earthen page', 'earthen-page', 2, '1', '2006-07-23 00:00:00', 'Georgia, ''Times New Roman'', Times, serif');

-- --------------------------------------------------------

--
-- Table structure for table `tblfriendlist`
--

CREATE TABLE IF NOT EXISTS `tblfriendlist` (
  `friendlistID` int(11) NOT NULL,
  `characterID` int(11) DEFAULT NULL,
  `friendID` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblfriendlist`
--

INSERT INTO `tblfriendlist` (`friendlistID`, `characterID`, `friendID`) VALUES
(1, 5, 6),
(2, 7, 8);

-- --------------------------------------------------------

--
-- Table structure for table `tblguildmembers`
--

CREATE TABLE IF NOT EXISTS `tblguildmembers` (
  `guildMemberID` int(11) NOT NULL,
  `guildID` int(11) DEFAULT NULL,
  `charID` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblguildmembers`
--

INSERT INTO `tblguildmembers` (`guildMemberID`, `guildID`, `charID`) VALUES
(1, 1, 1),
(2, 1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `tblguilds`
--

CREATE TABLE IF NOT EXISTS `tblguilds` (
  `guildID` int(11) NOT NULL,
  `guildName` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `createdTime` datetime DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblguilds`
--

INSERT INTO `tblguilds` (`guildID`, `guildName`, `cleanURL`, `createdTime`) VALUES
(1, 'The Caped Crusaders', 'the-caped-crusaders', '2007-07-21 15:39:45'),
(2, 'EarthenRing', 'earthenring', '2007-07-21 15:39:45');

-- --------------------------------------------------------

--
-- Table structure for table `tblinventoryitems`
--

CREATE TABLE IF NOT EXISTS `tblinventoryitems` (
  `itemID` int(11) NOT NULL,
  `shortname` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `priceCode` varchar(12) DEFAULT NULL,
  `tilex` decimal(11,1) DEFAULT NULL,
  `tiley` decimal(11,1) DEFAULT NULL,
  `worldGraphic` int(11) DEFAULT NULL,
  `requirements` varchar(50) DEFAULT NULL,
  `itemType` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblinventoryitems`
--

INSERT INTO `tblinventoryitems` (`itemID`, `shortname`, `description`, `priceCode`, `tilex`, `tiley`, `worldGraphic`, `requirements`, `itemType`) VALUES
(1, 'Empty Slot', '-', '-', '0.5', '0.5', 0, '0', 0),
(2, 'leaf', 'a broad shaped green leaf', '3', '0.5', '0.5', 0, '-', 0),
(3, 'dowsing rod', 'a finely made dowser''s rod', '2000x', '0.5', '0.5', 0, '-', 0),
(4, 'acorn', 'an ordinary acorn', '1', '0.5', '0.5', 0, '-', 0),
(5, 'seedling', 'a collection of unidentified seeds', '0', '0.5', '0.5', 0, '-', 0),
(6, 'mineral ore', 'a lump of inert rock', '420', '0.5', '0.5', 0, '-', 0),
(7, 'potion', 'a strange green liquid', '40p', '0.5', '0.5', 0, '-', 0),
(8, 'a rare mushroom', 'a very unusual mushroom', '0q', '0.5', '0.5', 0, '-', 0),
(9, 'trowel', 'an ordinary garden trowel', '0q', '0.5', '0.5', 0, '-', 0),
(10, 'mysterious potion', 'a strange liquid', '0q', '0.5', '0.5', 5, '-', 0),
(11, 'mushroom', 'tasty fungi', '20', '0.5', '0.5', 2, '-', 0),
(12, 'some clothing', 'a nice outfit', '90', '0.5', '0.5', 0, '-', 0),
(13, 'a rare gift', 'an unknown package', '450', '0.5', '0.5', 0, '-', 0),
(14, 'silence boots', 'silence inducing boots', '0u', '0.5', '0.5', 0, '-', 0),
(15, 'prism', 'a shining sculpture', '400x', '0.5', '0.5', 1, '-', 0),
(16, 'large back pack', 'a 6 slot container', '120b6', '0.5', '0.5', 0, '-', 0),
(17, 'signpost', '<-- harbour   amber coast -->', '-', '0.5', '0.5', 7, '-', 0),
(18, 'wanted poster', '5#reward offered for 2 prisms taken to the collector~`reward offered for 2 prisms taken to the collector~prisms successfully found', '-', '0.5', '0.5', 8, '-', 0),
(19, 'harvestable resource', '1.21/1.21/1.21/1.21/2.21/2.21/2.21/3.21/1.22/1.22|2.21', '-', '0.5', '0.5', 20, '-', 0),
(20, 'place holder for harvestable resource', 'ph', '1', '0.5', '0.5', 21, '-', 0),
(21, 'green frond', 'an ordinary fern', '5h', '0.5', '0.5', 0, '-', 0),
(22, 'gold frond', 'a rare fern', '200h', '0.5', '0.5', 0, '-', 0),
(23, 'ground chest closed', '-', '-', '0.5', '0.5', 10, '-', 0),
(24, 'ground chest open', '-', '-', '0.5', '0.5', 11, '-', 0),
(25, 'raised chest closed', '-', '-', '0.5', '0.5', 12, '-', 0),
(26, 'raised chest open', '-', '-', '0.5', '0.5', 13, '-', 0),
(27, 'silver coins', '-', '£', '0.5', '0.5', 0, '-', 0),
(28, 'gold coins', '-', '£', '0.5', '0.5', 0, '-', 0),
(29, 'large back pack', 'a 10 slot container', '200b10', '0.5', '0.5', 0, '-', 0),
(30, 'potion recipe', 'makes a mysterious potion', '10r10', '0.5', '0.5', 0, '1.21/2.22', 0),
(31, 'potion recipe', 'makes an ordinary potion', '4r7', '0.5', '0.5', 0, '1.11/250£', 0),
(32, 'potion recipe', 'makes a red prism', '4r15', '0.5', '0.5', 0, '1.11/150£', 0),
(33, 'rusty key', 'an antique key', '0u', '0.5', '0.5', 0, '-', 0),
(34, 'rusty key - used', 'an antique key - this key has been used', '0u', '0.5', '0.5', 0, '-', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblmail`
--

CREATE TABLE IF NOT EXISTS `tblmail` (
  `mailID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `senderID` int(11) DEFAULT NULL,
  `senderName` varchar(255) DEFAULT NULL,
  `characterID` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `mailContents` mediumtext,
  `sentTime` datetime DEFAULT NULL,
  `mailRead` char(1) DEFAULT NULL,
  `AttachmentType` int(11) DEFAULT NULL,
  `AttachmentQuantity` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblmail`
--

INSERT INTO `tblmail` (`mailID`, `accountID`, `senderID`, `senderName`, `characterID`, `title`, `mailContents`, `sentTime`, `mailRead`, `AttachmentType`, `AttachmentQuantity`) VALUES
(81, 18, 5, 'Eleaddai', 10, 'elli to newmemberchar1', 'c to c', '2006-08-02 22:10:06', '1', 0, 0),
(83, 5, 18, 'newmemberchar1', 2, 'Re: elli to newmemberchar1', '[quote=Eleaddai]c to c[/quote] m', '2006-08-02 22:13:05', '2', 0, 0),
(84, 18, 5, 'Eleaddai', 10, 'Re: Re: elli to newmemberchar1', '[quote=newmemberchar1][quote=Eleaddai]c to c[/quote] m[/quote]xc', '2006-08-02 22:13:30', '2', 0, 0),
(85, 14, 5, 'Alice', 0, 'alice to moderator', 'c to a', '2006-08-02 22:14:08', '1', 0, 0),
(86, 5, 14, 'moderator', 3, 'Re: alice to moderator', '[quote=Alice]c to a[/quote]x', '2006-08-02 22:14:24', '2', 0, 0),
(87, 14, 5, 'Alice', 0, 'Re: Re: alice to moderator', '[quote=moderator][quote=Alice]c to a[/quote]x[/quote]xc', '2006-08-02 22:14:59', '2', 0, 0),
(88, 14, 5, 'seawarrior', 0, 'seawarrior to moderator', 'a to a', '2006-08-02 22:15:22', '2', 0, 0),
(89, 5, 14, 'moderator', 0, 'Re: seawarrior to moderator', '[quote=seawarrior]a to a[/quote] ta', '2006-08-02 22:15:39', '2', 0, 0),
(90, 14, 5, 'seawarrior', 0, 'Re: Re: seawarrior to moderator', '[quote=moderator][quote=seawarrior]a to a[/quote] ta[/quote] cvc', '2006-08-02 22:15:56', '0', 0, 0),
(91, 18, 5, 'seawarrior', 10, 'seawarrior to newmemberchar1', 'a to c', '2006-08-02 22:16:31', '2', 0, 0),
(92, 5, 18, 'newmemberchar1', 0, 'Re: seawarrior to newmemberchar1', ' cheers', '2006-08-02 22:16:53', '1', 0, 0),
(93, 18, 5, 'seawarrior', 10, 'Re: Re: seawarrior to newmemberchar1', '[quote=newmemberchar1] cheers[/quote] go', '2006-08-02 22:17:07', '2', 0, 0),
(94, 18, 14, 'modchar2', 11, 'to newmem char2', 'dffd', '2006-08-03 14:08:45', '1', 0, 0),
(95, 14, 5, 'seawarrior', 0, 'styled stuff', 'fgfgfg[link=dfdf]dfdf[/link]cxcxc[image=xcx]\r\n\r\n\r\nh[u]ap[/u]py ', '2006-08-06 21:44:37', '1', 0, 0),
(96, 5, 14, 'moderator', 0, 'Re: styled stuff', '[quote=seawarrior]fgfgfg[link=dfdf]dfdf[/link]cxcxc[/quote][image=xcx]\r\n\r\n\r\nh[u]ap[/u]py  cheers boss :) [u]underline[/u][', '2006-08-06 21:46:52', '1', 0, 0),
(97, 14, 5, 'seawarrior', 0, 'blibllw', 'sd[s]fdf[/s] this is a report test', '2006-08-13 15:57:15', '1', 0, 0),
(98, 14, 5, 'seawarrior', 0, 'test atach', 'df', '2006-08-14 19:21:11', '0', 0, 0),
(99, 14, 5, 'seawarrior', 0, 'test', 'dfdf', '2006-08-14 19:22:59', '0', 0, 0),
(100, 14, 5, 'seawarrior', 0, 'test', 'dfdfdf', '2006-08-14 19:24:52', '0', 0, 0),
(101, 14, 5, 'seawarrior', 0, 'spam', 's', '2006-08-14 19:26:28', '0', 0, 0),
(102, 14, 5, 'seawarrior', 0, 'spam2', 'sdsd', '2006-08-14 19:27:02', '0', 0, 0),
(103, 14, 5, 'seawarrior', 0, 'spam3', 'dsds', '2006-08-14 19:28:33', '0', 0, 0),
(104, 14, 5, 'seawarrior', 0, 'spam4', 'dsds', '2006-08-14 19:29:59', '0', 0, 0),
(105, 14, 5, 'seawarrior', 0, 'sfdff', 'dfdf', '2006-08-14 19:31:19', '0', 0, 0),
(106, 14, 5, 'seawarrior', 0, 'guess what? spam', 'dsd', '2006-08-14 19:33:15', '0', 0, 0),
(107, 14, 5, 'seawarrior', 0, 'stuff', 'sdsd', '2006-08-14 21:48:17', '0', 0, 0),
(108, 14, 5, 'seawarrior', 0, 'test', 'test', '2006-08-17 13:02:52', '0', 0, 0),
(109, 14, 5, 'seawarrior', 0, 'testing', 'fdlfkdk lfkskf', '2006-08-17 13:12:46', '0', 0, 0),
(110, 14, 5, 'Eleaddai', 0, 'john', 'dddddd', '2006-08-17 13:27:41', '0', 0, 0),
(111, 5, 14, 'seawarrior', 0, 'Re: blibllw', '[quote=seawarrior]sdfdf this is a report test[/quote]fdf', '2006-08-17 20:45:01', '1', 0, 0),
(112, 14, 5, 'seawarrior', 0, 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghghh', '2006-08-17 20:46:00', '0', 0, 0),
(113, 14, 5, 'seawarrior', 0, 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]dfdfdfdf', '2006-08-17 20:47:17', '0', 0, 0),
(114, 14, 18, 'newmemberchar2', 8, 'Re: to newmem char2', '[quote=modchar2]dffd[/quote]\r\nklklk', '2006-08-17 20:48:22', '1', 0, 0),
(115, 14, 18, 'newmemberchar2', 8, 'Re: to newmem char2', '[quote=modchar2]dffd[/quote]', '2006-08-17 21:03:09', '0', 0, 0),
(116, 14, 5, 'seawarrior', 0, 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghg', '2006-08-17 21:03:46', '0', 0, 0),
(117, 14, 5, 'seawarrior', 0, 'howdo', 'dfdf', '2006-08-17 21:13:10', '0', 0, 0),
(118, 14, 5, 'seawarrior', 0, 'ljlj', 'lkj', '2006-08-17 21:13:56', '0', 0, 0),
(119, 14, 5, 'seawarrior', 0, 'lkj', 'lkj', '2006-08-17 21:15:54', '0', 0, 0),
(120, 14, 5, 'seawarrior', 0, 'jkh', 'kjhkh', '2006-08-17 21:16:09', '0', 0, 0),
(121, 14, 5, 'seawarrior', 0, '(untitled)', 'sd', '2006-08-17 21:23:42', '0', 0, 0),
(122, 14, 5, 'seawarrior', 0, 'adding items :)', 'here you go: 3 scrolls', '2006-08-20 10:44:47', '1', 0, 0),
(123, 14, 5, 'seawarrior', 0, 'teasing', 'asas', '2006-08-20 10:49:18', '0', 0, 0),
(124, 14, 5, 'seawarrior', 0, 'adding then changoing', '3 scrolls then 1 leaf', '2006-08-20 10:49:53', '1', 0, 0),
(125, 13, 5, 'seawarrior', 0, 'sending stuff', '1 mushroom coming at ya', '2006-08-20 11:15:20', '1', 11, 1),
(126, 14, 5, 'seawarrior', 0, 'another shrooom', '', '2006-08-20 11:17:31', '1', 0, 0),
(127, 14, 5, 'seawarrior', 0, 'removing 1 scroll', '1 scroll', '2006-08-20 11:28:46', '1', 0, 0),
(128, 14, 5, 'seawarrior', 0, 'all my shrooms', 'sdds', '2006-08-20 11:31:21', '1', 0, 0),
(129, 14, 5, 'seawarrior', 0, 'all 4 shrooms', 'sds', '2006-08-20 11:33:32', '1', 0, 0),
(130, 14, 5, 'seawarrior', 0, '9 shrooms', 'sd', '2006-08-20 11:37:22', '1', 11, 9),
(131, 14, 5, 'seawarrior', 0, 'sd', 'sdsd', '2006-08-20 20:29:10', '1', 0, 0),
(132, 14, 5, 'seawarrior', 0, 'sds', 'sd', '2006-08-20 20:29:20', '1', 0, 0),
(133, 5, 14, 'moderator', 0, 'df', 'df', '2006-08-20 20:32:20', '1', 0, 0),
(134, 14, 5, 'seawarrior', 0, 'sd', 'asas', '2006-08-20 20:34:20', '1', 0, 0),
(135, 14, 5, 'seawarrior', 0, 'df', 'dfsfd', '2006-08-20 20:37:45', '1', 0, 0),
(136, 5, 14, 'moderator', 0, 'cheers', 'cv', '2006-08-20 20:40:23', '2', 0, 0),
(137, 14, 5, 'seawarrior', 0, 'sddf', 'dfdf', '2006-08-20 20:41:35', '1', 0, 0),
(138, 14, 23, 'stanley', 0, 'sddsd', 'sads', '2006-08-20 20:42:41', '2', 2, 5),
(139, 5, 23, 'stanley', 1, 'stan to angel', '3 scrolls...', '2006-08-20 23:02:56', '1', 0, 0),
(140, 14, 23, 'stanley', 7, 'modchar1 from stan', 'sdsds', '2006-08-21 18:55:28', '1', 0, 0),
(141, 14, 5, 'seawarrior', 0, 'test attach', 'adding 2 scrolls', '2006-08-30 09:09:04', '1', 0, 0),
(142, 14, 5, 'seawarrior', 0, '(untitled)', '', '2006-11-05 10:42:52', '0', 2, 6),
(143, 14, 5, 'seawarrior', 0, '(untitled)', '', '2006-11-05 10:43:42', '0', 11, 1),
(144, 14, 5, 'Alice', 7, '1 gold', '1 gold!!!', '2006-12-02 21:40:27', '0', 0, 0),
(145, 14, 5, 'Alice', 7, '1 gold 27 s', '1g 27s', '2006-12-02 21:49:31', '0', 28, 127),
(146, 14, 5, 'seawarrior', 7, '21 silver', '21 !!!!', '2006-12-02 22:04:04', '0', 27, 21),
(147, 14, 5, 'seawarrior', 7, '21', '21 again', '2006-12-02 22:06:36', '0', 27, 21),
(148, 14, 5, 'seawarrior', 7, '21 .. .again!', 'df', '2006-12-02 22:07:52', '0', 27, 21),
(149, 14, 5, 'seawarrior', 7, '(untitled)', '', '2006-12-02 22:08:16', '0', 27, 21),
(150, 14, 5, 'seawarrior', 7, 'guess what?', '(no message)', '2006-12-02 22:10:27', '0', 27, 21),
(151, 14, 5, 'seawarrior', 7, 'sd', '(no message)', '2006-12-02 22:11:12', '0', 27, 21),
(152, 14, 5, 'Alice', 7, 'got to be 21 now', '(no message)', '2006-12-02 22:14:27', '0', 27, 21),
(153, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:18:16', '0', 27, 21),
(154, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:18:47', '0', 27, 22),
(155, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:20:48', '0', 27, 22),
(156, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:21:11', '0', 27, 23),
(157, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:22:27', '0', 27, 21),
(158, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:23:04', '0', 27, 21),
(159, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:23:28', '0', 28, 199),
(160, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:24:25', '0', 28, 102),
(161, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:24:38', '0', 28, 100),
(162, 14, 5, 'seawarrior', 7, '(untitled)', '(no message)', '2006-12-02 22:25:03', '0', 27, 20),
(163, 23, 5, 'seawarrior', 4, '(untitled)sd', '(no message)sd', '2006-12-18 22:27:09', '0', 28, 0),
(164, 23, 5, 'seawarrior', 4, 'hiya', 'fgfg', '2006-12-18 22:31:55', '0', 27, 0),
(165, 23, 5, 'seawarrior', 4, '18', 'eighteen coming across!', '2006-12-18 22:33:29', '0', 27, 0),
(166, 23, 5, 'Angel', 4, 'ten', 'fg ddf', '2006-12-18 22:46:19', '0', 27, 0),
(167, 23, 5, 'Angel', 4, 'seven', 'cvc', '2006-12-18 22:48:39', '0', 27, 0),
(168, 23, 5, 'Angel', 4, 'test', 'xc', '2006-12-18 22:49:30', '0', 27, 0),
(169, 23, 5, 'Angel', 4, 'ninteen', 'fd', '2006-12-18 22:50:20', '0', 27, 0),
(170, 23, 5, 'Angel', 4, 'sdsd', 'sd', '2006-12-18 22:51:09', '0', 27, 0),
(171, 23, 5, 'Angel', 4, '78', 'ghgh', '2006-12-18 22:53:01', '0', 27, 0),
(172, 23, 5, 'Angel', 1, 'fdfdf', '(no message)', '2006-12-18 22:57:28', '0', 27, 19),
(173, 23, 5, 'Angel', 1, 'hi', '(no message)', '2006-12-18 22:58:29', '0', 27, 19),
(174, 23, 5, 'Angel', 1, 'jkiol', 'gfg gddf ', '2006-12-18 22:59:53', '0', 27, 19),
(175, 23, 5, 'seawarrior', 1, 'more', '(no message)', '2006-12-18 23:00:23', '0', 28, 102),
(176, 13, 5, 'seawarrior', 0, 'testing refresh', 'testing! :) ', '2007-01-08 20:17:09', '1', 0, 0),
(177, 13, 5, 'seawarrior', 0, 'refresh test 2', 'dsd', '2007-01-08 20:17:46', '1', 0, 0),
(178, 13, 5, 'seawarrior', 0, 'another test', 'sdsd aa', '2007-01-08 20:38:42', '1', 0, 0),
(179, 5, 13, 'administrator', 0, 'Re: refresh test 2', '[quote=seawarrior]dsd[/quote]cheers matey', '2007-01-10 22:50:47', '1', 0, 0),
(180, 5, 13, 'administrator', 0, 'Re: another test', '[quote=seawarrior]sdsd aa[/quote]nice one', '2007-01-10 22:51:18', '0', 0, 0),
(181, 13, 5, 'seawarrior', 0, 'Re: Re: refresh test 2', 'thanks', '2007-01-10 22:54:13', '0', 0, 0),
(182, 49, 49, 'dilly21', 0, 'hi dilly', 'hi - how are you?', '2015-07-03 14:04:44', '1', 0, 0),
(183, 49, 48, 'dilly20', 0, 'dilly21', 'hi 21 - this is 20', '2015-07-03 14:05:11', '1', 0, 0),
(184, 48, 49, 'dilly21', 0, 'Re: dilly21', 'hi - good to hear from you [quote=dilly20]hi 21 - this is 20[/quote]', '2015-07-03 14:05:34', '1', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblmainpoll`
--

CREATE TABLE IF NOT EXISTS `tblmainpoll` (
  `pollID` int(11) NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `isCurrent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblmainpoll`
--

INSERT INTO `tblmainpoll` (`pollID`, `question`, `isCurrent`) VALUES
(1, 'is this site finished yet?', 1),
(2, 'would you be happy paying for additional items?', 0),
(3, 'what features would you like to see next?', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblmainpollchoices`
--

CREATE TABLE IF NOT EXISTS `tblmainpollchoices` (
  `choiceID` int(11) NOT NULL,
  `pollID` int(11) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `voteCount` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblmainpollchoices`
--

INSERT INTO `tblmainpollchoices` (`choiceID`, `pollID`, `response`, `voteCount`) VALUES
(1, 1, 'yes', 3),
(2, 1, 'no', 4),
(3, 1, 'don''t know', 9);

-- --------------------------------------------------------

--
-- Table structure for table `tblnews`
--

CREATE TABLE IF NOT EXISTS `tblnews` (
  `newsID` int(11) NOT NULL,
  `newsTitle` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `newsSynopsis` varchar(255) DEFAULT NULL,
  `newsContent` longtext,
  `status` char(1) DEFAULT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postedBy` varchar(50) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblnews`
--

INSERT INTO `tblnews` (`newsID`, `newsTitle`, `cleanURL`, `newsSynopsis`, `newsContent`, `status`, `timeAdded`, `postedBy`) VALUES
(1, 'Spring is on its way', 'spring-is-on-its-way', 'Face towards the rising sun and travel eastwards', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '1', '2015-07-09 10:19:41', NULL),
(2, 'New Year spectacular', 'new-year-spectacular', 'Fireworks and plenty of festive cheer', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '1', '2015-07-09 10:19:48', 'The Mayor'),
(3, 'more seasonal joy', 'more-seasonal-joy', 'brace yourselves!', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '1', '2015-07-09 10:19:54', NULL),
(4, 'April Fools has been and gone', 'april-fools-has-been-and-gone', 'well, we missed that one...', 'april fools has "been" &quot;and&quot; gone again &raquo; arrow', '1', '2015-07-09 10:20:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblposts`
--

CREATE TABLE IF NOT EXISTS `tblposts` (
  `postID` int(11) NOT NULL,
  `threadID` mediumint(9) NOT NULL DEFAULT '0',
  `accountID` int(11) NOT NULL DEFAULT '0',
  `creationTime` datetime DEFAULT NULL,
  `postContent` mediumtext,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL,
  `edited` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblposts`
--

INSERT INTO `tblposts` (`postID`, `threadID`, `accountID`, `creationTime`, `postContent`, `status`, `sticky`, `edited`) VALUES
(116, 24, 5, '2006-07-23 09:07:24', '[h]welcome everyone[/h] to this forum', '1', '0', '0000-00-00 00:00:00'),
(117, 24, 13, '2006-07-23 09:07:56', 'absolutely, please join in the discussion', '1', '0', '0000-00-00 00:00:00'),
(118, 25, 13, '2006-07-23 09:09:03', '[b]a bold message too[/b]', '1', '0', '0000-00-00 00:00:00'),
(119, 25, 13, '2006-07-23 09:13:18', 'an [i]italic [/i]post', '1', '0', '0000-00-00 00:00:00'),
(120, 26, 13, '2006-07-23 09:14:03', '1', '1', '0', '0000-00-00 00:00:00'),
(121, 26, 13, '2006-07-23 09:14:07', '2', '1', '0', '0000-00-00 00:00:00'),
(122, 26, 13, '2006-07-23 09:14:10', '3', '1', '0', '0000-00-00 00:00:00'),
(123, 26, 13, '2006-07-23 09:14:13', '4', '1', '0', '0000-00-00 00:00:00'),
(124, 26, 13, '2006-07-23 09:14:15', '5', '1', '0', '0000-00-00 00:00:00'),
(125, 26, 13, '2006-07-23 09:14:18', '6', '1', '0', '0000-00-00 00:00:00'),
(126, 26, 13, '2006-07-23 09:14:21', '7', '1', '0', '0000-00-00 00:00:00'),
(127, 26, 13, '2006-07-23 09:14:24', '8', '1', '0', '0000-00-00 00:00:00'),
(128, 26, 13, '2006-07-23 09:14:26', '9', '1', '0', '0000-00-00 00:00:00'),
(129, 26, 13, '2006-07-23 09:14:30', '10', '1', '0', '0000-00-00 00:00:00'),
(130, 26, 13, '2006-07-23 09:14:33', '11', '1', '0', '0000-00-00 00:00:00'),
(131, 26, 13, '2006-07-23 09:18:04', '12', '1', '0', '0000-00-00 00:00:00'),
(132, 26, 13, '2006-07-23 09:18:07', '13', '1', '0', '0000-00-00 00:00:00'),
(133, 26, 13, '2006-07-23 09:18:09', '14', '1', '0', '0000-00-00 00:00:00'),
(134, 26, 13, '2006-07-23 09:18:12', '15', '1', '0', '0000-00-00 00:00:00'),
(135, 27, 13, '2006-07-23 09:19:35', 'this is very seroius...', '1', '0', '0000-00-00 00:00:00'),
(136, 28, 13, '2006-07-23 09:20:57', 'so exciting all this, isn''t it?', '1', '0', '0000-00-00 00:00:00'),
(137, 26, 18, '2006-07-23 10:07:02', 'inserting link [link=location.co.uk]location.co.uk[/link]', '1', '0', '0000-00-00 00:00:00'),
(138, 26, 18, '2006-07-23 10:07:41', 'john [u]holt[/u] john', '1', '0', '2006-07-23 10:07:48'),
(139, 26, 18, '2006-07-23 10:13:28', 'adding a link [link=linklocation.co.uk]linklocation.co.uk[/link]', '1', '0', '0000-00-00 00:00:00'),
(140, 29, 18, '2006-07-23 10:22:42', 'good this :)', '1', '0', '0000-00-00 00:00:00'),
(141, 24, 13, '2006-07-23 14:29:41', 'a new posting', '1', '0', '0000-00-00 00:00:00'),
(142, 24, 13, '2006-07-23 14:29:58', 'another :)', '1', '0', '0000-00-00 00:00:00'),
(143, 30, 13, '2006-07-23 14:30:59', '...', '1', '0', '0000-00-00 00:00:00'),
(144, 24, 13, '2006-07-23 14:59:09', ':(', '1', '0', '0000-00-00 00:00:00'),
(145, 28, 5, '2006-07-23 16:11:27', 'seawarrior makes a post :)', '1', '0', '0000-00-00 00:00:00'),
(146, 28, 5, '2006-07-23 16:12:10', 'and another', '1', '0', '2006-07-23 16:13:45'),
(147, 28, 5, '2006-07-23 16:12:59', 'oi oi ', '1', '0', '2006-07-23 16:13:52'),
(148, 28, 13, '2006-07-23 16:25:39', 'admin response', '1', '0', '0000-00-00 00:00:00'),
(149, 28, 5, '2006-07-23 16:25:55', 'me again :)', '1', '0', '0000-00-00 00:00:00'),
(150, 28, 5, '2006-07-23 16:26:49', '...and again', '1', '0', '0000-00-00 00:00:00'),
(151, 28, 13, '2006-07-23 16:27:09', 'admin response #2', '1', '0', '0000-00-00 00:00:00'),
(152, 28, 5, '2006-07-23 16:29:08', 'seawarrior rcepsonse', '1', '0', '2006-07-28 09:14:09'),
(153, 28, 13, '2006-07-23 16:29:25', 'admin repsonse # 3', '1', '0', '0000-00-00 00:00:00'),
(154, 28, 5, '2006-07-23 16:30:24', '[u]seawarrior is back[/u]', '1', '0', '0000-00-00 00:00:00'),
(155, 24, 5, '2006-07-27 13:23:03', 'a link to [link=http://www.google.co.uk]google[/link]', '1', '0', '0000-00-00 00:00:00'),
(156, 31, 5, '2006-07-27 13:26:36', 'here''s a mail icon:\n\n[image=http://autumnearth.com/images/autumn-earth-old.gif]\ncool eh?', '1', '0', '2006-07-27 13:26:46'),
(157, 31, 5, '2006-07-27 13:27:14', 'here''s a quick quote that i made up\r\n\r\n[quote = john]stuff john said[/quote]', '1', '0', '2006-07-27 13:28:20'),
(158, 31, 5, '2006-07-27 13:29:29', 'and a link to [link=http://www.flashkit.com]flashkit[/link] is here', '1', '0', '0000-00-00 00:00:00'),
(159, 31, 5, '2006-07-27 13:32:52', 'a huuuuge image [b]with a link[/b]:\r\n\r\n\r\n\r\n\r\n[link=www.salmacis.co.uk]\r\n[/link][image=http://www.salmacis.co.uk/elements/splash_page531x531.jpg]but it''s been[ cropped', '1', '0', '2006-07-27 22:04:02'),
(160, 31, 5, '2006-07-27 13:41:32', 'just this [image=''http://www.salmacis.co.uk/elements/lookingglass1b.jpg'']', '1', '0', '2006-07-27 13:52:30'),
(161, 31, 13, '2006-07-27 18:25:59', 'badly nested tags:\n[b]bold text [/b][image = http://autumnearth.com/images/autumn-earth-old.gif]\n\nclose bold ', '1', '0', '2006-07-27 18:37:02'),
(162, 31, 14, '2006-07-27 21:13:26', '[u] underlined [/u][image=http://autumnearth.com/images/autumn-earth-old.gif]\nnormal [b] bold[/b]', '1', '0', '0000-00-00 00:00:00'),
(163, 31, 14, '2006-07-27 21:25:59', 'close bold  and i''ve then [h]added this[/h]', '1', '0', '2006-07-27 21:34:39'),
(164, 30, 14, '2006-07-27 21:35:14', '[quote=Administrator]...[/quote] and my bit :)', '1', '0', '0000-00-00 00:00:00'),
(165, 31, 14, '2006-07-27 21:37:28', '[quote=seawarrior]here''s a mail icon:\r\n\r\n\r\ncool eh?[/quote] and my bit', '1', '0', '0000-00-00 00:00:00'),
(166, 31, 14, '2006-07-27 21:39:23', '[quote=Moderator]here''s a mail icon:\r\n\r\n\r\ncool eh? and my bit[/quote] and yet another bit', '1', '0', '0000-00-00 00:00:00'),
(167, 31, 14, '2006-07-27 21:39:54', '[quote=seawarrior]and a link to flashkit is here[/quote] without link', '1', '0', '0000-00-00 00:00:00'),
(168, 30, 5, '2006-07-27 21:55:23', '[e]invalid links [t] and [r]', '1', '0', '0000-00-00 00:00:00'),
(169, 24, 5, '2006-07-28 07:45:33', '[quote=seawarrior]welcome everyone to this forum[/quote]\r\nnow i''ll add a link [link=http://www.google.com]http://www.google.com[/link]', '1', '0', '0000-00-00 00:00:00'),
(170, 24, 5, '2006-07-28 07:46:14', 'lots of space:\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nend', '1', '0', '2006-07-28 08:41:42'),
(171, 30, 5, '2006-07-28 09:07:14', 'mew post', '1', '0', '0000-00-00 00:00:00'),
(172, 28, 5, '2006-07-28 21:21:35', 'dfdf', '1', '0', '0000-00-00 00:00:00'),
(173, 26, 5, '2006-07-29 23:49:21', 'oi', '1', '0', '0000-00-00 00:00:00'),
(174, 30, 5, '2006-08-01 18:27:05', '[quote=seawarrior]mew post[/quote]sorry\r\n', '1', '0', '0000-00-00 00:00:00'),
(175, 30, 5, '2006-08-13 11:06:42', '[linkninglinkng', '1', '0', '0000-00-00 00:00:00'),
(176, 32, 5, '2006-08-13 11:07:19', 'lin[link=ok.com]kni[/link]nglinkng', '1', '0', '0000-00-00 00:00:00'),
(177, 28, 5, '2006-08-13 11:23:36', 'stuff adding stuff', '1', '0', '0000-00-00 00:00:00'),
(178, 28, 5, '2006-08-13 11:25:57', 'stuff and link', '1', '0', '0000-00-00 00:00:00'),
(179, 28, 5, '2006-08-13 11:26:56', 'stuff link and link', '1', '0', '0000-00-00 00:00:00'),
(180, 31, 5, '2006-08-13 11:34:06', 'stuff posting', '1', '0', '0000-00-00 00:00:00'),
(181, 31, 5, '2006-08-13 11:37:51', 'stuff linking stuff', '1', '0', '0000-00-00 00:00:00'),
(182, 31, 5, '2006-08-13 11:39:13', 'post link ', '1', '0', '0000-00-00 00:00:00'),
(183, 31, 5, '2006-08-13 11:39:45', 'and another ', '1', '0', '0000-00-00 00:00:00'),
(184, 31, 5, '2006-08-13 11:40:31', '[linklinklink', '1', '0', '0000-00-00 00:00:00'),
(185, 31, 5, '2006-08-13 11:41:17', 'anotheranother', '1', '0', '0000-00-00 00:00:00'),
(186, 31, 5, '2006-08-13 11:43:17', 'stuffsdsdsd', '1', '0', '0000-00-00 00:00:00'),
(187, 31, 5, '2006-08-13 11:43:48', 'gfhghgh g', '1', '0', '0000-00-00 00:00:00'),
(188, 31, 5, '2006-08-13 11:44:34', 'hjhjhgjhgj', '1', '0', '0000-00-00 00:00:00'),
(189, 31, 5, '2006-08-13 12:00:07', 'fgfdgfdgfggg fd', '1', '0', '0000-00-00 00:00:00'),
(190, 31, 5, '2006-08-13 12:02:19', 'fgfgfgfdgfgf', '1', '0', '0000-00-00 00:00:00'),
(191, 31, 5, '2006-08-13 12:03:06', 'ghghghggh', '1', '0', '0000-00-00 00:00:00'),
(192, 31, 5, '2006-08-13 12:05:24', 'gfk[link=df]lgjdf[/link]lgjldfjgldfg', '1', '0', '0000-00-00 00:00:00'),
(193, 32, 5, '2006-08-13 12:10:10', 'gkhgkh;[link=john.com]gkh;[/link]g;hg;hgfhgf', '1', '0', '0000-00-00 00:00:00'),
(194, 29, 14, '2006-08-13 12:11:37', 'gkjkj[link=http://www.john.com]hgj[/link]ljhlgjhjglhjfljhlgjhlgfjlh', '1', '0', '0000-00-00 00:00:00'),
(195, 29, 14, '2006-08-13 12:12:09', 'gh[link=gh]hgg[/link]ghg', '1', '0', '0000-00-00 00:00:00'),
(196, 33, 5, '2006-08-13 12:15:14', 'johnjohn[link=ohyeah.co.uk]is[/link]john', '1', '0', '2006-09-11 08:55:30'),
(197, 34, 5, '2006-08-13 12:18:38', 'stufff with [link=http://www.google.com]links [/link]and stuff ', '1', '0', '0000-00-00 00:00:00'),
(198, 35, 5, '2006-08-13 12:22:03', 'xcxcxc[image=http://www.autumnearth.com/data/chr3/portrait.jpg]xcxczxcsc ', '1', '0', '0000-00-00 00:00:00'),
(199, 35, 5, '2006-10-26 19:38:26', '[link=http://www.goole.com]link[/link]', '1', '0', '0000-00-00 00:00:00'),
(200, 28, 5, '2006-12-31 20:04:51', 'what''s all this then? is this john''s post?', '1', '0', '0000-00-00 00:00:00'),
(201, 28, 5, '2006-12-31 20:21:06', '...hang on, what''s this one then?\r\n...oh, i get it :)', '1', '0', '0000-00-00 00:00:00'),
(202, 25, 5, '2007-01-01 22:55:17', 'JOHN''S post', '1', '0', '0000-00-00 00:00:00'),
(203, 25, 5, '2007-01-01 23:18:05', '[quote=Administrator]a bold message too[/quote] checking :)', '1', '0', '0000-00-00 00:00:00'),
(204, 25, 5, '2007-01-11 21:36:36', '&quot;what''s all this then?&quot; he asked', '1', '0', '0000-00-00 00:00:00'),
(205, 34, 5, '2007-02-12 11:08:02', 'hiya', '1', '0', '0000-00-00 00:00:00'),
(206, 36, 5, '2007-05-08 18:33:13', 'what components/tools do I need to start herbalism?', '1', '0', '0000-00-00 00:00:00'),
(207, 34, 5, '2007-05-08 18:33:54', 'feeding pets? how does that work? ', '1', '0', '0000-00-00 00:00:00'),
(208, 31, 5, '2007-05-09 08:48:11', 'pet development - sounds good', '1', '0', '0000-00-00 00:00:00'),
(209, 35, 39, '2015-06-30 12:52:16', 'hi, this is Dilly', '1', '0', '0000-00-00 00:00:00'),
(210, 37, 39, '2015-06-30 16:50:43', 'hi, I&#039;m Dilly.\r\nMeoow.\r\n[image=http://www.autumnearth.com/development/graphics/scene.jpg]\r\ngood eh?', '1', '0', '0000-00-00 00:00:00'),
(211, 38, 48, '2015-07-15 13:08:12', 'stuff', '1', '0', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblsavedsearches`
--

CREATE TABLE IF NOT EXISTS `tblsavedsearches` (
  `searchID` int(11) NOT NULL,
  `searchTerm` varchar(255) DEFAULT NULL,
  `searchCount` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblsavedsearches`
--

INSERT INTO `tblsavedsearches` (`searchID`, `searchTerm`, `searchCount`) VALUES
(1, 'crafting', 6),
(2, 'feeding pets', 2),
(3, 'image', 7),
(4, 'autumn', 2),
(5, 'autumn earth', 2),
(6, 'character development', 0),
(11, 'pte development', 0),
(8, 'pet development', 2),
(10, 'pte development', 0),
(12, 'pet developmetn', 0),
(13, 'carfting', 0),
(14, 'carfting', 0),
(15, 'feeding ptse', 0),
(16, 'feding pste', 0),
(17, 'cheese', 0),
(18, 'gemai', 0),
(19, 'iiiimage', 0),
(20, 'crrrrrrrrrafting', 0),
(21, 'speling', 0),
(22, 'fgf', 1),
(23, 'gf', 1),
(24, 'mail', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tblsubscribedthreads`
--

CREATE TABLE IF NOT EXISTS `tblsubscribedthreads` (
  `subthreadID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `threadID` int(11) DEFAULT NULL,
  `status` char(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblsubscribedthreads`
--

INSERT INTO `tblsubscribedthreads` (`subthreadID`, `accountID`, `threadID`, `status`) VALUES
(5, 13, 30, '1'),
(18, 13, 31, '1'),
(24, 14, 25, '1'),
(28, 14, 31, '1'),
(29, 5, 31, '1'),
(30, 5, 30, '1'),
(31, 5, 32, '1'),
(32, 5, 28, '1'),
(33, 14, 29, '0'),
(34, 5, 33, '1'),
(35, 5, 34, '1'),
(36, 5, 35, '1'),
(37, 5, 25, '1'),
(38, 5, 36, '1'),
(39, 39, 35, '0'),
(40, 39, 37, '0'),
(41, 48, 38, '0');

-- --------------------------------------------------------

--
-- Table structure for table `tblthreads`
--

CREATE TABLE IF NOT EXISTS `tblthreads` (
  `threadID` int(11) NOT NULL,
  `forumID` int(11) DEFAULT NULL,
  `accountID` int(11) DEFAULT NULL,
  `viewCount` int(11) DEFAULT NULL,
  `CreationTime` datetime DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL,
  `title` mediumtext,
  `cleanURL` varchar(255) DEFAULT NULL,
  `latestPostID` int(11) DEFAULT NULL,
  `postcount` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblthreads`
--

INSERT INTO `tblthreads` (`threadID`, `forumID`, `accountID`, `viewCount`, `CreationTime`, `status`, `sticky`, `title`, `cleanURL`, `latestPostID`, `postcount`) VALUES
(24, 3, 5, 26, '2006-07-23 09:07:24', '2', '0', 'Welcome, Welcome', 'general-discussion/welcome-welcome', 170, 8),
(25, 3, 13, 27, '2006-07-23 09:09:03', '2', '0', '[b]this is a bold title[/b]', 'general-discussion/this-is-a-bold-title', 204, 5),
(26, 3, 13, 19, '2006-07-23 09:14:03', '2', '0', 'counting...', 'general-discussion/counting', 173, 19),
(27, 3, 13, 11, '2006-07-23 09:19:35', '1', '1', 'Important Announcement', 'general-discussion/important-announcement', 135, 1),
(28, 3, 13, 25, '2006-07-23 09:20:57', '2', '0', 'another thread', 'general-discussion/another-thread', 201, 17),
(29, 2, 18, 20, '2006-07-23 10:22:42', '2', '0', 'hello', 'suggestions/hello', 195, 3),
(30, 3, 13, 27, '2006-07-23 14:30:59', '2', '0', 'new thread :)', 'general-discussion/new-thread', 175, 6),
(31, 1, 5, 48, '2006-07-27 13:26:36', '2', '0', 'showing an image', 'bug-reports/showing-an-image', 208, 25),
(32, 3, 5, 43, '2006-08-13 11:07:19', '2', '0', 'john', 'general-discussion/john', 193, 2),
(33, 3, 5, 15, '2006-08-13 12:15:14', '2', '0', 'my title', 'general-discussion/my-title', 196, 1),
(34, 3, 5, 54, '2006-08-13 12:18:38', '2', '0', 'googlelink', 'general-discussion/googlelink', 207, 3),
(35, 3, 5, 20, '2006-08-13 12:22:03', '2', '0', 'l=img thread', 'general-discussion/l-img-thread', 209, 3),
(36, 2, 5, 26, '2007-05-08 18:33:13', '2', '0', 'crafting', 'suggestions/crafting', 206, 1),
(37, 3, 39, 1, '2015-06-30 16:50:43', '2', '0', 'dilly&#039;s here', 'general-discussion/dillys-here', 210, 1),
(38, 3, 48, 0, '2015-07-15 13:08:11', '2', '0', 'new one', 'general-discussion/new-one', 211, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblacct`
--
ALTER TABLE `tblacct`
  ADD PRIMARY KEY (`accountID`), ADD UNIQUE KEY `accountName` (`accountName`);

--
-- Indexes for table `tblauctionbids`
--
ALTER TABLE `tblauctionbids`
  ADD PRIMARY KEY (`bidID`);

--
-- Indexes for table `tblauctionitems`
--
ALTER TABLE `tblauctionitems`
  ADD PRIMARY KEY (`auctionID`);

--
-- Indexes for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  ADD PRIMARY KEY (`charID`);

--
-- Indexes for table `tblevents`
--
ALTER TABLE `tblevents`
  ADD PRIMARY KEY (`eventID`);

--
-- Indexes for table `tblforums`
--
ALTER TABLE `tblforums`
  ADD PRIMARY KEY (`forumID`);

--
-- Indexes for table `tblfreeformpages`
--
ALTER TABLE `tblfreeformpages`
  ADD PRIMARY KEY (`pageID`);

--
-- Indexes for table `tblfriendlist`
--
ALTER TABLE `tblfriendlist`
  ADD PRIMARY KEY (`friendlistID`), ADD UNIQUE KEY `friendlistID` (`friendlistID`);

--
-- Indexes for table `tblguildmembers`
--
ALTER TABLE `tblguildmembers`
  ADD PRIMARY KEY (`guildMemberID`);

--
-- Indexes for table `tblguilds`
--
ALTER TABLE `tblguilds`
  ADD UNIQUE KEY `guildID` (`guildID`), ADD UNIQUE KEY `guildName` (`guildName`);

--
-- Indexes for table `tblinventoryitems`
--
ALTER TABLE `tblinventoryitems`
  ADD PRIMARY KEY (`itemID`);

--
-- Indexes for table `tblmail`
--
ALTER TABLE `tblmail`
  ADD PRIMARY KEY (`mailID`);

--
-- Indexes for table `tblmainpoll`
--
ALTER TABLE `tblmainpoll`
  ADD PRIMARY KEY (`pollID`);

--
-- Indexes for table `tblmainpollchoices`
--
ALTER TABLE `tblmainpollchoices`
  ADD PRIMARY KEY (`choiceID`);

--
-- Indexes for table `tblnews`
--
ALTER TABLE `tblnews`
  ADD PRIMARY KEY (`newsID`);

--
-- Indexes for table `tblposts`
--
ALTER TABLE `tblposts`
  ADD PRIMARY KEY (`postID`);

--
-- Indexes for table `tblsavedsearches`
--
ALTER TABLE `tblsavedsearches`
  ADD PRIMARY KEY (`searchID`);

--
-- Indexes for table `tblsubscribedthreads`
--
ALTER TABLE `tblsubscribedthreads`
  ADD PRIMARY KEY (`subthreadID`);

--
-- Indexes for table `tblthreads`
--
ALTER TABLE `tblthreads`
  ADD PRIMARY KEY (`threadID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblacct`
--
ALTER TABLE `tblacct`
  MODIFY `accountID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `tblauctionbids`
--
ALTER TABLE `tblauctionbids`
  MODIFY `bidID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `tblauctionitems`
--
ALTER TABLE `tblauctionitems`
  MODIFY `auctionID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  MODIFY `charID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `tblevents`
--
ALTER TABLE `tblevents`
  MODIFY `eventID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `tblforums`
--
ALTER TABLE `tblforums`
  MODIFY `forumID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblfreeformpages`
--
ALTER TABLE `tblfreeformpages`
  MODIFY `pageID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblfriendlist`
--
ALTER TABLE `tblfriendlist`
  MODIFY `friendlistID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tblguildmembers`
--
ALTER TABLE `tblguildmembers`
  MODIFY `guildMemberID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tblguilds`
--
ALTER TABLE `tblguilds`
  MODIFY `guildID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tblinventoryitems`
--
ALTER TABLE `tblinventoryitems`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `tblmail`
--
ALTER TABLE `tblmail`
  MODIFY `mailID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=185;
--
-- AUTO_INCREMENT for table `tblmainpoll`
--
ALTER TABLE `tblmainpoll`
  MODIFY `pollID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblmainpollchoices`
--
ALTER TABLE `tblmainpollchoices`
  MODIFY `choiceID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblnews`
--
ALTER TABLE `tblnews`
  MODIFY `newsID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tblposts`
--
ALTER TABLE `tblposts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=212;
--
-- AUTO_INCREMENT for table `tblsavedsearches`
--
ALTER TABLE `tblsavedsearches`
  MODIFY `searchID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `tblsubscribedthreads`
--
ALTER TABLE `tblsubscribedthreads`
  MODIFY `subthreadID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `tblthreads`
--
ALTER TABLE `tblthreads`
  MODIFY `threadID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=39;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
