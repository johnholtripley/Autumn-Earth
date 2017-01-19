-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2017 at 02:54 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;

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
(48, 'dilly20', '2', '2015-07-03 14:02:41', '0', 13, 15, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'ÞÉ/ê;}6Ôx|Ökd', 'dilly20', '1', '1', '3dcbb605f6e3545f33d0e1fe54042f97', '127.0.0.1'),
(49, 'dilly21', '2', '2015-07-03 14:03:09', '0', 0, 16, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'œé+''ÍÍiffA`jÔ@', 'dilly21', '1', '1', '55561f21c5445a16e9e306fae400b08c', '127.0.0.1'),
(50, 'dilly22', '2', '2015-08-04 15:10:24', '0', 0, 1, 'john.holtripley@gmail.com', '2007-04-03 00:00:00', '1', '1', '.{[ÄX%tl¢"ÔÉF', 'sdsd', '1', '1', 'fb4d713852301b8dff21ff63f376b45f', '127.0.0.1'),
(51, 'test', '2', '2015-11-20 14:31:58', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '®)ª¹ì?¨åÑ·“¯ä¥', '', '1', '1', '9c7129e26978a03b58eb1a6375c50067', '127.0.0.1');

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblauctionitems`
--

INSERT INTO `tblauctionitems` (`auctionID`, `startTime`, `endTime`, `sellerID`, `itemID`, `quantity`, `buyItNowPrice`, `reservePrice`, `startPrice`, `auctionClosed`) VALUES
(1, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 13, 6, 4, -1, -1, 20, 0),
(2, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 5, 24, 10, 100, -1, 20, 0),
(3, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 13, 24, 2, -1, 45, 20, 0),
(4, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 2, 2, 10, -1, -1, 20, 0),
(5, '2007-10-18 21:08:58', '2007-10-28 21:08:58', 5, 6, 1, 10, -1, 20, 0),
(6, '2015-07-12 00:00:00', '2015-07-21 21:08:58', 13, 13, 6, -1, -1, 20, 0),
(7, '2015-07-13 00:00:00', '2015-07-16 21:08:58', 13, 12, 6, -1, -1, 20, 0),
(8, '2015-07-14 00:00:00', '2015-07-17 00:00:00', 13, 6, 4, -1, -1, 20, 0),
(9, '2015-07-14 00:00:00', '2015-07-31 00:00:00', 13, 4, 4, 100, -1, 15, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblcards`
--

CREATE TABLE IF NOT EXISTS `tblcards` (
  `cardID` int(11) NOT NULL,
  `cardAttack` int(2) NOT NULL,
  `cardDefense` int(2) NOT NULL,
  `cardName` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcards`
--

INSERT INTO `tblcards` (`cardID`, `cardAttack`, `cardDefense`, `cardName`) VALUES
(1, 5, 10, 'Bomb'),
(2, 5, 10, 'Chocobo'),
(3, 5, 10, 'Mog'),
(4, 5, 10, 'Cactuar'),
(5, 5, 10, 'Shiva'),
(6, 5, 10, 'Tonberry'),
(7, 5, 10, 'Slime');

-- --------------------------------------------------------

--
-- Table structure for table `tblcharacters`
--

CREATE TABLE IF NOT EXISTS `tblcharacters` (
  `charID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `charName` varchar(25) DEFAULT NULL,
  `location` int(255) DEFAULT NULL,
  `gamestate` longtext,
  `journalstate` longtext,
  `queststate` longtext,
  `petstate` longtext,
  `currentbag` varchar(4) DEFAULT NULL,
  `inventorystate` longtext,
  `currentCards` longtext NOT NULL,
  `money` varchar(12) DEFAULT NULL,
  `house` int(11) NOT NULL DEFAULT '0',
  `minutesplayed` int(11) unsigned DEFAULT NULL,
  `guildID` int(11) DEFAULT '0',
  `guildmembersince` date DEFAULT NULL,
  `404MagicSquareSum` varchar(255) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcharacters`
--

INSERT INTO `tblcharacters` (`charID`, `accountID`, `charName`, `location`, `gamestate`, `journalstate`, `queststate`, `petstate`, `currentbag`, `inventorystate`, `currentCards`, `money`, `house`, `minutesplayed`, `guildID`, `guildmembersince`, `404MagicSquareSum`) VALUES
(1, 5, 'Angel', 1, '&amp;playsounds=true&amp;herox=23&amp;heroy=9&amp;dowseskill=0&amp;famskill=70&amp;currentmapnumber=1&amp;heightgained=0', 'travel to the coast', '0/0/0/0/0/0', '2,0,100,24,7,-1,0,0,0,0,pet,15,12,13', '16', '32,4/2,8/9,1/1,2/10,3/33,1', '', '299', 0, 1125, 0, '2007-03-30', '9|17|56'),
(2, 5, 'Eleaddai', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(3, 5, 'Alice', 2, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(4, 23, 'Eric', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', '501', 0, 200, 0, '2007-03-30', '-1'),
(5, 13, 'Adminchar1', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', '0', 0, 200, 0, '2007-03-30', '-1'),
(6, 13, 'Adminchar2', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', '20', 0, 200, 0, '2007-03-30', '-1'),
(7, 14, 'modchar1', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(8, 14, 'modchar2', 2, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(9, 15, 'johnchar1', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(10, 18, 'newmemberchar1', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(11, 18, 'newmemberchar2', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(12, 13, 'Angel', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(13, 14, 'Angel', 3, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2007-03-30', '-1'),
(14, 39, 'eleaddaiMeow', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2015-06-30', '-1'),
(15, 39, 'dilly20', 4, NULL, NULL, NULL, NULL, NULL, NULL, '1,2,3,1,2,1,1,1,2,1,2,3', NULL, 0, 200, 0, '2015-06-30', '10|38|60'),
(16, 39, 'dilly21', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2015-06-30', '-1'),
(17, 50, 'dilly22', 1, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 0, 200, 0, '2015-06-30', '-1');

-- --------------------------------------------------------

--
-- Table structure for table `tblcolours`
--

CREATE TABLE IF NOT EXISTS `tblcolours` (
  `colourID` int(11) NOT NULL,
  `colourName` varchar(128) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcolours`
--

INSERT INTO `tblcolours` (`colourID`, `colourName`) VALUES
(0, ''),
(1, 'Crimson'),
(2, 'Yellow'),
(3, 'Orange'),
(4, 'Blue'),
(5, 'Purple'),
(6, 'Green'),
(7, 'Brown'),
(8, 'White'),
(9, 'Pink'),
(10, '(light yellow/cream)'),
(11, '(light orange/coral)'),
(12, 'Aquamarine'),
(13, 'Violet'),
(14, '(light green/lime)'),
(15, 'Tawny'),
(16, 'Black'),
(18, '(dark yellow/amber)'),
(19, '(dark orange/sienna)'),
(20, '(dark blue/sapphire)'),
(21, '(indigo/imperial purple)'),
(22, '(dark green/emerald/olive)'),
(23, '(dark brown/chestnut)'),
(24, 'Grey');

-- --------------------------------------------------------

--
-- Table structure for table `tblcontractbids`
--

CREATE TABLE IF NOT EXISTS `tblcontractbids` (
  `bidID` int(255) NOT NULL,
  `contractID` int(255) NOT NULL,
  `characterID` int(255) NOT NULL,
  `bidAmount` int(255) NOT NULL,
  `bidPlaced` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcontractbids`
--

INSERT INTO `tblcontractbids` (`bidID`, `contractID`, `characterID`, `bidAmount`, `bidPlaced`) VALUES
(1, 1, 4, 8, '2015-07-21 00:00:00'),
(2, 1, 8, 12, '2015-07-21 00:21:00'),
(3, 1, 10, 17, '2015-07-21 18:00:00'),
(4, 3, 12, 100, '2015-07-21 18:00:00'),
(5, 3, 12, 108, '2015-07-21 18:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblcontracts`
--

CREATE TABLE IF NOT EXISTS `tblcontracts` (
  `contractID` int(255) NOT NULL,
  `contractStart` datetime NOT NULL,
  `contractEnd` datetime NOT NULL,
  `characterID` int(255) NOT NULL,
  `itemID` int(255) NOT NULL,
  `quantity` int(255) NOT NULL,
  `contractType` int(1) NOT NULL,
  `startLocation` int(255) NOT NULL,
  `endLocation` int(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcontracts`
--

INSERT INTO `tblcontracts` (`contractID`, `contractStart`, `contractEnd`, `characterID`, `itemID`, `quantity`, `contractType`, `startLocation`, `endLocation`) VALUES
(1, '2014-07-01 00:00:00', '2014-10-22 00:00:00', 15, 6, 6, 1, 1, 4),
(2, '2015-07-09 00:28:00', '2015-08-27 19:00:00', 8, 16, 1, 1, 4, 2),
(3, '2015-07-09 00:28:00', '2015-10-30 00:00:00', 8, 11, 4, 2, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbldungeonachievements`
--

CREATE TABLE IF NOT EXISTS `tbldungeonachievements` (
  `index` int(255) NOT NULL,
  `charId` int(255) NOT NULL,
  `dungeonId` int(255) NOT NULL,
  `mapReached` int(255) NOT NULL,
  `timeStamp` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbldungeonachievements`
--

INSERT INTO `tbldungeonachievements` (`index`, `charId`, `dungeonId`, `mapReached`, `timeStamp`) VALUES
(1, 5, 1, 76, '2015-07-15 00:00:00'),
(2, 15, 1, 78, '2015-07-02 00:00:00'),
(3, 16, 1, 133, '2015-07-01 00:00:00'),
(4, 15, 1, 135, '2015-07-24 11:00:00'),
(5, 16, 2, 23, '2015-07-23 00:00:00'),
(6, 16, 3, 12, '2015-06-14 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbldungeonmapconfig`
--

CREATE TABLE IF NOT EXISTS `tbldungeonmapconfig` (
  `dungeonId` int(11) NOT NULL,
  `dungeonName` varchar(255) COLLATE utf8_bin NOT NULL,
  `cleanURL` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbldungeonmapconfig`
--

INSERT INTO `tbldungeonmapconfig` (`dungeonId`, `dungeonName`, `cleanURL`) VALUES
(1, 'The Barrow Mines', 'the-barrow-mines'),
(2, 'Wyrmhole', 'wyrmhole'),
(3, 'Frogmorton Caverns', 'frogmorton-caverns');

-- --------------------------------------------------------

--
-- Table structure for table `tblevents`
--

CREATE TABLE IF NOT EXISTS `tblevents` (
  `eventID` int(11) NOT NULL,
  `eventStart` datetime DEFAULT NULL,
  `eventEnd` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `eventContent` longtext NOT NULL,
  `css` varchar(25) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblevents`
--

INSERT INTO `tblevents` (`eventID`, `eventStart`, `eventEnd`, `title`, `summary`, `eventContent`, `css`, `cleanURL`) VALUES
(1, '2006-08-27 00:00:00', '2006-09-01 00:00:00', 'halloween events part4', 'halloween event', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'CHalloween', 'halloween-events-part4'),
(2, '2006-08-03 00:00:00', '2006-08-08 00:00:00', 'halloween events part1', 'halloween event', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'CHalloween', 'halloween-events-part1'),
(3, '2015-08-07 00:00:00', '2015-08-14 00:00:00', 'halloween events part2', 'halloween event', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'CHalloween', 'halloween-events-part2'),
(4, '2016-08-23 00:00:00', '2016-08-31 00:00:00', 'halloween events part3', 'halloween event', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'CHalloween', 'halloween-events-part3'),
(5, '2015-12-21 00:00:00', '2015-12-25 00:00:00', 'Christmas', 'happy christmas', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'CHalloween', 'christmas');

-- --------------------------------------------------------

--
-- Table structure for table `tblforums`
--

CREATE TABLE IF NOT EXISTS `tblforums` (
  `forumID` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) NOT NULL,
  `description` mediumtext,
  `imagePath` varchar(255) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblforums`
--

INSERT INTO `tblforums` (`forumID`, `title`, `cleanURL`, `description`, `imagePath`, `status`, `sticky`) VALUES
(1, 'Bug Reports', 'bug-reports', 'Found a bug? Let us know about it here.', '/images/forum/bugforum.gif', '2', '1'),
(2, 'Suggestions', 'suggestions', 'Thought of an improvement? Let us know what features you''d like to see in the next update.', '/images/forum/suggestforum.gif', '2', '1'),
(3, 'General Discussion', 'general-discussion', 'Want to meet other players? find and chat to them here.', '/images/forum/generalforum.gif', '2', '1');

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
  `centreX` decimal(11,1) DEFAULT NULL,
  `centreY` decimal(11,1) DEFAULT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `actionValue` int(11) NOT NULL,
  `dyeable` tinyint(1) NOT NULL,
  `level` int(11) NOT NULL,
  `prerequisites` varchar(255) NOT NULL,
  `itemGroup` varchar(10) NOT NULL,
  `itemCategories` varchar(128) DEFAULT NULL,
  `inscribable` tinyint(1) NOT NULL,
  `colour` int(128) NOT NULL,
  `hasInherentColour` tinyint(1) NOT NULL DEFAULT '0',
  `showInTheCodex` tinyint(1) NOT NULL DEFAULT '1',
  `lockedToThisPlayer` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblinventoryitems`
--

INSERT INTO `tblinventoryitems` (`itemID`, `shortname`, `description`, `priceCode`, `centreX`, `centreY`, `width`, `height`, `cleanURL`, `action`, `actionValue`, `dyeable`, `level`, `prerequisites`, `itemGroup`, `itemCategories`, `inscribable`, `colour`, `hasInherentColour`, `showInTheCodex`, `lockedToThisPlayer`) VALUES
(1, 'Wild Flax', '-', '1', '20.0', '24.0', 0, 0, 'wild-flax', '', 0, 0, 0, '0', '0', '1', 0, 0, 0, 1, 0),
(2, 'Wild Madder', 'A flower used for its red pigment.', '1', '20.0', '24.0', 0, 0, 'wild-madder', '', 0, 0, 0, '0', '0', '1', 0, 1, 1, 1, 0),
(3, 'Safflower', 'A flower used for its yellow pigment.', '1', '20.0', '24.0', 0, 0, 'safflower', '', 0, 0, 0, '0', '0', '1', 0, 2, 1, 1, 0),
(5, 'Whortleberry', 'The berries are used for their blue colour.', '1', '20.0', '24.0', 0, 0, 'whortleberry', '', 0, 0, 0, '0', '0', '1', 0, 4, 1, 1, 0),
(6, 'Meadowsweet', 'Used to make black pigments.', '1', '20.0', '24.0', 0, 0, 'meadowsweet', '', 0, 0, 0, '0', '0', '1', 0, 16, 1, 1, 0),
(7, 'Archil', 'A purple dye.', '1', '20.0', '24.0', 0, 0, 'archil', '', 0, 1, 0, '0', 'dye', '2', 0, 5, 1, 1, 0),
(8, 'Copper Mordant', 'A standard mordant.', '1', '20.0', '24.0', 0, 0, 'copper-mordant', '', 0, 0, 0, '0', 'mrdt', '2', 0, 0, 0, 1, 0),
(9, 'Iron Mordant', 'A mordant for making darker dyes.', '1', '20.0', '24.0', 0, 0, 'iron-mordant', '', 0, 0, 0, '0', 'mrdt', '2', 0, 16, 1, 1, 0),
(10, 'Alum Mordant', 'A mordant used for brighter dyes.', '1', '20.0', '24.0', 0, 0, 'alum-mordant', '', 0, 0, 0, '0', 'mrdt', '2', 0, 8, 1, 1, 0),
(11, 'Small Glass Bottle', '', '1', '20.0', '24.0', 0, 0, 'small-glass-bottle', '', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(12, 'Dye', 'A standard pigment dye.', '1', '20.0', '24.0', 0, 0, 'dye', '', 0, 1, 0, '0', 'dye', '2', 0, 0, 0, 1, 0),
(13, 'Dyer''s Cauldron', '', '1', '20.0', '24.0', 0, 0, 'dyers-cauldron', 'craft', 0, 0, 0, '0', '0', '2', 0, 0, 0, 1, 0),
(14, 'Linen', 'A useful fabric.', '1', '20.0', '24.0', 0, 0, 'linen', '', 0, 1, 0, '0', '0', '3', 0, 0, 0, 1, 0),
(15, 'Wool', 'Basic wool, unspun.', '1', '20.0', '24.0', 0, 0, 'wool', '', 0, 1, 0, '0', '0', '3', 0, 0, 0, 1, 0),
(16, 'Yarn', 'Spun wool.', '1', '20.0', '24.0', 0, 0, 'yarn', '', 0, 1, 0, '0', '0', '3', 0, 0, 0, 1, 0),
(17, 'Small Backpack', 'A 11 slot bag', '2', '20.0', '24.0', 0, 0, 'small-backpack', 'bag', 11, 1, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(18, 'Barrel', 'A large wooden barrel.', '2', '25.0', '31.0', 38, 38, 'barrel', 'static', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(19, 'Pumpkin', 'A tasty pumpkin.', '1', '16.0', '18.0', 25, 23, 'pumpkin', '', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(20, 'Large Backpack', 'A 20 slot bag', '2', '20.0', '24.0', 0, 0, 'large-backpack', 'bag', 20, 1, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(21, 'Card Pack', '5 cards', '4', '20.0', '24.0', 0, 0, 'card-pack', 'booster', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(22, 'Standing Stone', '', '4', '49.0', '81.0', 63, 63, 'standing-stone', 'questToggle', 2, 0, 0, '0', '0', NULL, 0, 0, 0, 0, 0),
(23, 'Mugwort', 'Used to make green dyes', '4', '49.0', '81.0', 63, 63, 'mugwort', '', 0, 0, 0, '0', '0', '1', 0, 6, 1, 1, 0),
(24, 'Rim Lichen', 'Used to make purple dyes', '4', '49.0', '81.0', 63, 63, 'rim-lichen', '', 0, 0, 0, '0', '0', '1', 0, 5, 1, 1, 0),
(25, 'Spring water', '', '4', '49.0', '81.0', 63, 63, 'spring-water', '', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(26, 'Wood Ash', '', '4', '49.0', '81.0', 63, 63, 'wood-ash', '', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(27, 'Apple Wood', '', '4', '49.0', '81.0', 63, 63, 'apple-wood', '', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(28, 'Lye', 'Used for bleaching', '4', '49.0', '81.0', 63, 63, 'lye', '', 0, 0, 0, '0', '0', NULL, 0, 8, 1, 1, 0),
(29, 'Green Dye Recipe', 'Learn how to make a green dye.', '4', '49.0', '81.0', 63, 63, '', 'recipe', 9, 0, 0, '0', 'scribe', NULL, 0, 0, 0, 1, 0),
(30, 'Weaver''s Loom', 'Tools for weaving and tailoring', '1', '20.0', '24.0', 0, 0, 'weavers-loom', 'craft', 1, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0),
(31, 'Wrapped gift', 'Double click to see what''s inside. Contains: ##contains##', '4', '49.0', '81.0', 63, 63, 'wrapped-gift', 'container', 0, 0, 0, '0', '0', NULL, 0, 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblitemcategories`
--

CREATE TABLE IF NOT EXISTS `tblitemcategories` (
  `categoryID` int(11) NOT NULL,
  `categoryName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblitemcategories`
--

INSERT INTO `tblitemcategories` (`categoryID`, `categoryName`) VALUES
(1, 'Plants and Herbs'),
(2, 'Dyer''s Provisions'),
(3, 'Tailor''s Provisions');

-- --------------------------------------------------------

--
-- Table structure for table `tblitemgroups`
--

CREATE TABLE IF NOT EXISTS `tblitemgroups` (
  `itemGroupID` int(11) NOT NULL,
  `itemGroupCode` varchar(255) DEFAULT NULL,
  `itemGroupDescription` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblitemgroups`
--

INSERT INTO `tblitemgroups` (`itemGroupID`, `itemGroupCode`, `itemGroupDescription`) VALUES
(0, '0', '0'),
(1, 'mrdt', 'Any mordant'),
(2, 'dye', 'Any dye'),
(3, 'scribe', 'Anything that a Scribe can copy'),
(4, 'enchant', 'Any item with raw magical properties');

-- --------------------------------------------------------

--
-- Table structure for table `tbllocations`
--

CREATE TABLE IF NOT EXISTS `tbllocations` (
  `locID` int(255) NOT NULL,
  `locName` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbllocations`
--

INSERT INTO `tbllocations` (`locID`, `locName`) VALUES
(1, 'Anvil'),
(2, 'Anchor'),
(3, 'Ratchet Hill'),
(4, 'Farthingate');

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
  `bannerContent` varchar(255) NOT NULL,
  `status` char(1) DEFAULT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postedBy` varchar(50) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblnews`
--

INSERT INTO `tblnews` (`newsID`, `newsTitle`, `cleanURL`, `newsSynopsis`, `newsContent`, `bannerContent`, `status`, `timeAdded`, `postedBy`) VALUES
(1, 'Spring is on its way', 'spring-is-on-its-way', 'Face towards the rising sun and travel eastwards', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2015-07-09 10:19:41', NULL),
(2, 'New Year spectacular', 'new-year-spectacular', 'Fireworks and plenty of festive cheer', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2009-07-09 10:19:48', 'The Mayor'),
(3, 'more seasonal joy', 'more-seasonal-joy', 'brace yourselves!', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href="/" title="click to view">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2015-07-09 10:19:54', NULL),
(4, 'April Fools has been and gone', 'april-fools-has-been-and-gone', 'well, we missed that one...', 'april fools has been &quot;and&quot; gone again &raquo; arrow', '', '1', '2015-07-22 12:45:53', NULL),
(5, 'Dragon flare', 'dragon-flare', 'Look up - in the sky', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis non elit a tempor. Nam commodo metus eget libero faucibus euismod. Vivamus interdum porta ante non finibus. Nam velit nisi, consectetur et tempor vitae, varius eu tortor. Duis ac eleifend libero, eu sagittis purus. Dragon nunc aliquam ut sapien sit amet molestie. Etiam pellentesque tristique vestibulum. Maecenas lacinia, arcu eu hendrerit eleifend, purus nulla ornare turpis, et bibendum sapien lectus non nulla. Ut facilisis lobortis nisi, id faucibus dolor molestie vel. Aliquam a mi at ligula accumsan pellentesque. Etiam pulvinar mauris ac justo semper efficitur. Ut lobortis egestas laoreet. Curabitur dui ex, placerat id nisl quis, malesuada consectetur lectus. Duis tincidunt congue commodo. In hac habitasse platea dictumst. ', '', '1', '2015-08-12 12:45:53', NULL),
(6, 'Down the rabbit hole', 'down-the-rabbit-hole', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\n<h3>And then</h3>\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\n<h3>After that</h3>\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-02 08:23:36', NULL),
(7, 'article 7', 'article-7', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-03 08:23:36', NULL),
(8, 'article 8', 'article-8', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-04 08:23:36', NULL),
(9, 'article 9', 'article-9', 'Spring rising and the end of winter dawns. Time to celebrate and join the festivities.', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-06 08:24:36', NULL),
(10, 'article 10', 'article-10', 'here''s something', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-05 12:59:34', NULL);
INSERT INTO `tblnews` (`newsID`, `newsTitle`, `cleanURL`, `newsSynopsis`, `newsContent`, `bannerContent`, `status`, `timeAdded`, `postedBy`) VALUES
(11, 'article 11', 'article-11', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-07 08:23:36', NULL),
(12, 'article 12', 'article-12', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-08 08:23:36', NULL),
(13, 'article 13', 'article-13', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-10 08:23:36', NULL),
(14, 'article 14', 'article-14', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-08 08:23:36', NULL),
(15, 'article 15', 'article-15', 'Donec vulputate, ipsum eu scelerisque scelerisque, massa risus molestie erat, a commodo urna sapien quis turpis. Quisque sit amet mattis arcu, et sodales sem. Aenean dictum neque semper, placerat mi ultricies, consequat orci. ', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-14 17:29:37', NULL),
(16, 'article 16', 'article-16', 'Here''s some news', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href="#">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href="#">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href="#">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href="#">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', 'placeholder.jpg', '1', '2016-03-30 08:57:00', 'The Mayor');

-- --------------------------------------------------------

--
-- Table structure for table `tblplants`
--

CREATE TABLE IF NOT EXISTS `tblplants` (
  `plantID` int(11) NOT NULL,
  `latinName` varchar(255) COLLATE utf8_bin NOT NULL,
  `commonNames` varchar(512) COLLATE utf8_bin NOT NULL,
  `plantDesc` longtext COLLATE utf8_bin NOT NULL,
  `plantUrl` varchar(255) COLLATE utf8_bin NOT NULL,
  `tweetedContent` varchar(255) COLLATE utf8_bin NOT NULL,
  `isAquatic` tinyint(1) DEFAULT NULL,
  `isNight` tinyint(1) NOT NULL DEFAULT '0',
  `timeCreated` datetime NOT NULL,
  `plantSeed` int(255) NOT NULL,
  `commonNamesJoined` varchar(512) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblplants`
--

INSERT INTO `tblplants` (`plantID`, `latinName`, `commonNames`, `plantDesc`, `plantUrl`, `tweetedContent`, `isAquatic`, `isNight`, `timeCreated`, `plantSeed`, `commonNamesJoined`) VALUES
(258, 'Curcumarachis trilliacetum', 'Blueflower or Lesser plumheather', 'A shimmering, bright perennial wild flower .  Flowers from June to August.  Prolific in its production of flowers.  Slightly fragrant and can be used as cut flowers.', 'curcumarachis-trilliacetum', 'Curcumarachis trilliacetum\r\n(Blueflower or Lesser plumheather)\r\nA shimmering, bright perennial wild flower .  Flowers from June to August.', 0, 0, '2016-11-18 10:01:19', 1479515068, 'Blueflower/Lesser plumheather'),
(259, 'Choilex caerucidenta', 'Lacehood', 'A tall, widespread, native annual, common in cornfields and waste places. The fluffy red flowers are the earliest flowering of the common hedge bank parsleys.', 'choilex-caerucidenta', 'Choilex caerucidenta\r\n(Lacehood)\r\nA tall, widespread, native annual, common in cornfields and waste places.', 0, 0, '2016-11-18 10:01:33', 1479549058, 'Lacehood'),
(260, 'Barbaregari melanchier', 'Cinderwand, Halfheather or Falsethimble', 'A once common perennial weed of ditches, marshes, pond edges, and river banks, now rarely seen. The deep red flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'barbaregari-melanchier', 'Barbaregari melanchier\r\n(Cinderwand, Halfheather or Falsethimble)', 0, 0, '2016-11-18 10:01:41', 1479466020, 'Cinderwand/Halfheather/Falsethimble'),
(261, 'Vulanum bliteum', 'Hollowthrift or Maidenstorch', 'A tall, widespread, native biennial, common in cornfields and waste places. The fluffy yellow flowers are the earliest flowering of the common hedge bank parsleys.', 'vulanum-bliteum', 'Vulanum bliteum\r\n(Hollowthrift or Maidenstorch)\r\nA tall, widespread, native biennial, common in cornfields and waste places.', 0, 0, '2016-11-18 10:01:50', 1479475481, 'Hollowthrift/Maidenstorch'),
(262, 'Flavula ptarmine', 'Witchcreeper, Maywrack or Brightroyal', 'A widely occuring sea dwelling plant.', 'flavula-ptarmine', 'Flavula ptarmine\r\n(Witchcreeper, Maywrack or Brightroyal)\r\nA widely occuring sea dwelling plant.', 1, 0, '2016-11-18 10:01:57', 1479535832, 'Witchcreeper/Maywrack/Brightroyal'),
(263, 'Brassiilex dranthenicotina', 'Sweetsleeves', 'A scrambling annual commonly found in a wide variety of habitats including cornfields and waste places.', 'brassiilex-dranthenicotina', 'Brassiilex dranthenicotina\r\n(Sweetsleeves)', 0, 0, '2016-11-18 10:02:11', 1479545619, 'Sweetsleeves'),
(264, 'Amplexicaulea luticaroburnum', 'Autumnbloom or Eldew', 'A beautiful, bright annual widely occuringly naturalised in disturbed ground, farm land and walls. Its petals are used as a main ingredient in various herbal remedies. The flowers open in the evening and are visited by a large number of Moth species.', 'amplexicaulea-luticaroburnum', 'Amplexicaulea luticaroburnum\r\n(Autumnbloom or Eldew)', 0, 0, '2016-11-18 10:02:18', 1479530672, 'Autumnbloom/Eldew'),
(265, 'Traeamomum charide', 'Morrowarrow or Wychwort', 'A native perennial with creeping stems, common in hedgerows and pathways.', 'traeamomum-charide', 'Traeamomum charide\r\n(Morrowarrow or Wychwort)\r\nA native perennial with creeping stems, common in hedgerows and pathways.', 0, 0, '2016-11-18 10:02:25', 1479525519, 'Morrowarrow/Wychwort'),
(266, 'Pensilva hesperis', 'Autumnrushes or Sweethorn', 'A tall, widespread, native annual, common in woods, hedges, pastures, heaths and rocky areas. The fluffy deep red flowers are the earliest flowering of the common hedge bank parsleys.', 'pensilva-hesperis', 'Pensilva hesperis\r\n(Autumnrushes or Sweethorn)\r\nA tall, widespread, native annual, common in woods, hedges, pastures, heaths and rocky areas.', 0, 0, '2016-11-18 10:02:34', 1479503078, 'Autumnrushes/Sweethorn'),
(267, 'Tectosatio traeamelanchier', 'Common ghostbrier', 'A once common annual weed of cornfields and waste places, now rarely seen. The light blue flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'tectosatio-traeamelanchier', 'Tectosatio traeamelanchier\r\n(Common ghostbrier)\r\nA once common annual weed of cornfields and waste places, now rarely seen.', 0, 0, '2016-11-18 10:02:44', 1479523347, 'Common ghostbrier'),
(268, 'Brassia drantheniacer', 'Glorytongue', 'Widely used in days gone by to curdle milk for cheese making.', 'brassia-drantheniacer', 'Brassia drantheniacer\r\n(Glorytongue)\r\nWidely used in days gone by to curdle milk for cheese making.', 0, 0, '2016-11-18 10:02:51', 1479499092, 'Glorytongue'),
(269, 'Verticilla ambrosica', 'Greater emberpaw', 'A once common annual weed of woods and hedges, now rarely seen. The pale blue flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'verticilla-ambrosica', 'Verticilla ambrosica\r\n(Greater emberpaw)\r\nA once common annual weed of woods and hedges, now rarely seen.', 0, 0, '2016-11-18 10:02:59', 1479555143, 'Greater emberpaw'),
(270, 'Parvirinum glutinosa', 'Saintstuber, Lesser song orchid or Stonesedge', 'A native annual with creeping stems, common in disturbed ground, farm land and walls.', 'parvirinum-glutinosa', 'Parvirinum glutinosa\r\n(Saintstuber, Lesser song orchid or Stonesedge)', 0, 0, '2016-11-18 10:03:08', 1479487606, 'Saintstuber/Lesser song orchid/Stonesedge'),
(271, 'Beckia crocardamine', 'Riverholly, Stavebeam or Pouchpurse', 'A rare creeping native perennial of dry grassland and roadside, with dark red flowers. An excellent nector plant and a caterpillar food plant for the Silken processionary butterfly. Height: 10-40cm (4-16in) Perennial: Flowers May to Sept. Contains plant toxins.', 'beckia-crocardamine', 'Beckia crocardamine\r\n(Riverholly, Stavebeam or Pouchpurse)', 0, 0, '2016-11-18 10:03:15', 1479495853, 'Riverholly/Stavebeam/Pouchpurse');

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
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=latin1;

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
(198, 35, 5, '2006-08-13 12:22:03', 'xcxcxc[image=http://www.autumnearth.com/data/chr3/portait.jpg]xcxczxcsc ', '1', '0', '0000-00-00 00:00:00'),
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
(211, 38, 48, '2015-07-15 13:08:12', 'stuff', '1', '0', '0000-00-00 00:00:00'),
(212, 39, 48, '2015-07-16 13:51:46', 'hi', '1', '0', '0000-00-00 00:00:00'),
(213, 40, 48, '2015-07-17 15:36:48', 'meow suggest', '1', '0', '0000-00-00 00:00:00'),
(214, 41, 48, '2015-07-17 15:39:03', 'mew', '1', '0', '0000-00-00 00:00:00'),
(215, 42, 48, '2015-07-17 15:39:20', 'mew', '1', '0', '0000-00-00 00:00:00'),
(216, 43, 48, '2015-07-17 15:39:36', 'mew 2', '1', '0', '0000-00-00 00:00:00'),
(217, 44, 48, '2015-07-22 13:26:29', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit orci ac ultricies ornare. Sed hendrerit lorem at lacus finibus eleifend. Curabitur porta sollicitudin vestibulum. Vestibulum pharetra eleifend sagittis. Phasellus a sapien quam. Curabitur interdum risus nisl, in consequat nibh convallis sed. Donec porta consectetur urna commodo egestas. Donec laoreet arcu vel porta hendrerit. Nullam lobortis metus tristique magna venenatis scelerisque. Maecenas ullamcorper elit nec tortor egestas faucibus. Curabitur vulputate, massa non tempus finibus, nulla magna lacinia arcu, non aliquam metus mi a magna. Nullam rutrum dolor porttitor fermentum placerat. Praesent convallis turpis dapibus nulla rutrum, eget malesuada lacus porttitor. In hac habitasse platea dictumst. Morbi dui orci, tempor vel rhoncus et, porta vel urna.\r\n\r\nQuisque finibus metus mollis iaculis blandit. Nunc consequat pharetra porta. Nulla turpis ipsum, scelerisque vel iaculis in, convallis quis arcu. Sed et posuere nisl. Praesent ac nunc hendrerit, consectetur ipsum ac, mollis libero. Integer ac tempor enim. Vivamus interdum felis ligula, venenatis vestibulum libero euismod id. Ut vulputate dictum ultricies. Fusce laoreet quam nec finibus rhoncus. ', '1', '0', '0000-00-00 00:00:00'),
(218, 45, 48, '2015-08-06 10:39:31', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed scelerisque dapibus ligula. Cras a enim vitae justo luctus placerat. Aliquam eget rhoncus lacus. Phasellus vel lacus et mauris bibendum maximus id id elit. Integer placerat ut turpis et luctus. Donec quis lacus enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum quis augue tincidunt laoreet.\r\n\r\nSed vel pretium mauris, tempor faucibus diam. Ut ut est sed sapien facilisis elementum eu nec lectus. Vivamus libero augue, lobortis sit amet auctor at, viverra vel ipsum. Fusce non quam risus. Integer vitae neque dolor. Fusce quis nibh commodo, feugiat elit a, ultrices nisl. Curabitur nibh leo, rhoncus ut est et, feugiat varius orci. ', '1', '0', '0000-00-00 00:00:00'),
(219, 46, 48, '2015-08-06 10:42:11', ' Etiam laoreet ac nisl vitae rutrum. Nullam eu quam malesuada, mollis nisl eget, elementum augue. In leo nulla, luctus sit amet nibh lacinia, iaculis dignissim felis. Duis vel enim erat. Quisque ut justo purus. Suspendisse id nibh ac mauris blandit fermentum sit amet at metus. Nulla tempor tempus pulvinar. In maximus suscipit quam, ut faucibus mauris. Integer feugiat felis elit, a faucibus justo dapibus eleifend. Nullam gravida tristique massa, vitae cursus sem rhoncus fringilla. Donec sit amet lorem rhoncus, lobortis erat vitae, lacinia felis.\r\n\r\nMaecenas rutrum pellentesque ullamcorper. Mauris molestie, eros quis fermentum pretium, arcu erat imperdiet nunc, eget sollicitudin felis sapien eget odio. Nulla euismod tincidunt orci vitae varius. Aenean hendrerit a nibh at vulputate. Nulla ut euismod mi, a vulputate mi. Donec congue velit a pretium sodales. Donec odio neque, pharetra a convallis in, imperdiet id purus. Etiam et finibus mi. Quisque eget consequat dui. Pellentesque dragon body aliquam pulvinar arcu, eget dictum purus placerat ut. Vivamus quis odio ante. ', '1', '0', '0000-00-00 00:00:00'),
(220, 47, 48, '2015-08-06 10:42:31', ' Etiam laoreet ac nisl vitae rutrum. Nullam eu quam malesuada, mollis nisl eget, elementum augue. In leo nulla, luctus sit amet nibh lacinia, iaculis dignissim felis. Duis vel enim erat. Quisque ut justo purus. Suspendisse id nibh ac mauris blandit fermentum sit amet at metus. Nulla tempor tempus pulvinar. In maximus suscipit quam, ut faucibus mauris. Integer feugiat felis elit, a faucibus justo dapibus eleifend. Nullam gravida tristique massa, vitae cursus sem rhoncus fringilla. Donec sit amet lorem rhoncus, lobortis erat vitae, lacinia felis.\r\n\r\nMaecenas rutrum pellentesque ullamcorper. Mauris molestie, eros quis fermentum pretium, arcu erat imperdiet nunc, eget sollicitudin felis sapien eget odio. Nulla euismod tincidunt orci vitae varius. Aenean hendrerit a nibh at vulputate. Nulla ut euismod mi, a vulputate mi. Donec congue velit a pretium sodales. Donec odio neque, pharetra a convallis in, imperdiet id purus. Etiam et finibus mi. Quisque eget consequat dui. Pellentesque dragon both aliquam pulvinar arcu, eget dictum purus placerat ut. Vivamus quis odio ante. ', '1', '0', '0000-00-00 00:00:00'),
(221, 48, 48, '2015-08-07 09:08:42', '\r\n\r\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non egestas ex. Nulla sollicitudin id felis eleifend laoreet. Proin eleifend leo leo, ultrices varius tellus fringilla id. Fusce congue porta nisl, a egestas mi tincidunt eget. Quisque fringilla convallis tempus. Nam dragon imperdiet in sem ut dapibus. Vestibulum imperdiet semper massa ac condimentum. Sed eu tempus libero, et aliquet leo. Aliquam leo dolor, accumsan et viverra at, faucibus id nibh. Mauris tincidunt, odio eu tempus rhoncus, leo eros rhoncus eros, at condimentum orci lorem at ligula. Quisque erat mi, sollicitudin sit amet varius vel, ultrices nec urna.\r\n\r\nQuisque finibus ante eu blandit accumsan. Nullam vitae tempor ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Nunc dapibus gravida diam, vulputate blandit ipsum lobortis nec. Cras fringilla ut neque sed tincidunt. Nulla aliquet neque eu orci scelerisque, bibendum laoreet ipsum semper. Nullam dictum dignissim sem, vel efficitur lacus. In hendrerit porta ligula, non sagittis diam tempor a. Nunc tincidunt nec turpis quis elementum. Etiam non blandit sapien, a scelerisque ex. Nunc et nunc eu velit consectetur lacinia. Maecenas quis gravida ex.\r\n\r\nInteger vulputate commodo lorem nec varius. Nulla facilisi. Nullam nec massa ut magna ultrices finibus. Duis dragons sollicitudin pulvinar pulvinar. Nunc ultricies libero posuere lorem scelerisque consectetur. Ut quis pulvinar neque. Nam non volutpat nulla. Phasellus et posuere libero, et fringilla metus. Duis porttitor quis nibh quis pretium.\r\n\r\nNunc ac vulputate libero, vel lobortis lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed vel pulvinar felis. Proin eu euismod elit. Aliquam erat volutpat. Vivamus porta felis libero, a euismod nunc blandit ut. Pellentesque elementum purus in libero vulputate, quis commodo dolor aliquet. Aliquam aliquet neque a maximus tincidunt. Donec quis velit at quam laoreet semper sed vel neque. Vestibulum a gravida lacus.\r\n\r\nSed consectetur enim in lectus venenatis, in auctor felis dictum. Donec consequat, eros in placerat lobortis, eros libero tempor purus, ac consequat purus ligula eu lacus. In ut nisl dui. Vestibulum ornare, arcu non eleifend aliquam, ex urna egestas sem, ac bibendum lacus dragonkind diam ac dolor. Quisque nibh nisl, eleifend non nunc consectetur, hendrerit suscipit dolor. Integer in turpis quis elit convallis posuere et et ipsum. Aliquam accumsan ullamcorper porta. ', '1', '0', '0000-00-00 00:00:00'),
(222, 49, 48, '2015-08-07 13:21:23', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in efficitur mauris. Cras eu lectus dapibus, tincidunt sem eu, consectetur diam. Cras sagittis, tellus vitae euismod maximus, purus mauris consectetur nisi, ac fermentum ligula lectus vitae sem. Proin dapibus purus at tellus tincidunt pretium. In id quam porta ante porttitor commodo vitae ac neque. Donec vulputate sed mauris ac suscipit. Nam ac sapien id tortor ullamcorper suscipit. Fusce maximus, tellus eget suscipit placerat, magna lorem interdum elit, at fermentum felis mi nec ante. Sed semper lectus placerat metus accumsan ultrices. Nulla commodo eleifend risus sit amet rhoncus. Cras sed commodo nulla. Nullam finibus leo sit amet elit dapibus euismod. Integer ornare libero non accumsan aliquam. Morbi commodo blandit iaculis.\r\n\r\nMaecenas nibh ipsum, malesuada ut consequat ac, suscipit vel nulla. Maecenas nisl libero, efficitur ut nulla ut, venenatis mollis risus. Donec eleifend efficitur sagittis. Fusce vel sodales nunc. Phasellus at quam euismod turpis efficitur euismod. Vivamus in felis ac erat dignissim condimentum. Nam sed enim mauris. Praesent nec lorem sit amet nisi vulputate interdum sit amet non ex. Duis ut mauris velit.\r\n\r\nNam interdum ipsum sed purus maximus sollicitudin. Pellentesque sit amet tortor tincidunt, ultricies nunc a, vestibulum dolor. Donec tincidunt rutrum tellus quis porta. Nulla facilisi. Fusce gravida fringilla justo, at pulvinar felis faucibus sed. Nulla facilisi. Etiam blandit egestas placerat. Etiam risus lacus, ultrices at ipsum sed, volutpat molestie massa. Nam ut ante fermentum, fermentum turpis imperdiet, sodales diam. Mauris molestie dui eu dui dapibus, quis imperdiet neque posuere. Sed hendrerit sapien eget dictum interdum. Nam tempor dictum urna egestas ornare. Vivamus tristique mi sit amet velit pharetra pretium. Duis ac condimentum dolor. Fusce porta, mi et fringilla elementum, urna ex semper libero, id aliquam mauris ex sed turpis. Pellentesque orci mi, rhoncus id erat nec, rutrum interdum mauris.\r\n\r\nUt vel imperdiet metus, vel ultrices est. Sed euismod nibh eu turpis pulvinar varius. Proin vel justo nec leo facilisis sagittis nec vitae nibh. Suspendisse faucibus porta maximus. Suspendisse ac vulputate justo. Etiam dignissim velit enim, et viverra quam posuere a. Nam pharetra aliquet consequat. Maecenas et accumsan nulla, sit amet pulvinar massa. Etiam at lorem nunc. Vestibulum lobortis leo id nulla efficitur efficitur quis eu ex.\r\n\r\nInterdum et malesuada fames ac ante ipsum primis in faucibus. Aenean ut eros at ante cursus imperdiet sed eget ex. Phasellus convallis neque dolor, nec varius ex pretium eu. Proin dolor elit, fermentum in turpis id, faucibus egestas tellus. Sed faucibus nulla orci, vitae eleifend tellus mollis sit amet. Sed mauris sapien, volutpat at mollis nec, facilisis eget orci. Aliquam pellentesque hendrerit nunc eget ultrices. Mauris a sapien dictum tortor ultricies rhoncus sit amet quis quam. Nunc fermentum imperdiet ullamcorper. Vivamus tristique mollis sodales. Vestibulum fringilla, sapien sit amet placerat pharetra, purus dolor convallis velit, in lobortis elit tellus interdum ex. Vivamus consequat dapibus sapien, nec faucibus nunc eleifend eu. Nulla consequat porttitor ullamcorper.\r\n\r\nDonec vel magna congue, sagittis leo eget, suscipit massa. Quisque placerat porta est a congue. Aenean mattis fermentum dolor at pretium. In hac habitasse platea dictumst. Sed euismod diam eu metus rutrum eleifend. Suspendisse bibendum at lectus ut vestibulum. Mauris accumsan eleifend turpis ut sagittis. Integer risus massa, maximus eget eros tincidunt, fringilla suscipit sem. Etiam efficitur massa eu eros varius ultrices. Morbi consectetur ante viverra nibh vestibulum consectetur. Sed justo ligula, volutpat quis aliquam vitae, feugiat id magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec molestie velit magna, ut rhoncus neque mollis sit amet. In vitae blandit velit. Sed porttitor enim eget orci dictum, ut mattis velit volutpat.\r\n\r\nSuspendisse et turpis et nunc posuere viverra. Vestibulum imperdiet volutpat ligula, sed tincidunt ante mattis nec. Aenean rutrum nibh in ipsum pellentesque vestibulum. Nulla nec nulla at velit volutpat imperdiet. Mauris mattis pulvinar metus. Pellentesque tristique euismod nibh, sed bibendum arcu hendrerit ac. Nulla facilisi. Suspendisse pretium ex ex, eu laoreet quam mollis ac. Etiam a neque varius, tempor arcu sit amet, vehicula diam. Praesent quis neque consectetur, molestie dolor ut, blandit arcu. Nulla sit amet posuere felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer ac nisi ut urna malesuada malesuada vel quis tortor. Maecenas cursus ante sed quam suscipit mollis. Pellentesque semper velit laoreet augue mattis, sed tincidunt quam luctus.\r\n\r\nDonec et augue id nisl mattis placerat. Fusce imperdiet leo non enim varius, a rutrum tortor sodales. Suspendisse potenti. Praesent nec consequat diam. Curabitur sodales malesuada arcu convallis pulvinar. Ut volutpat leo non augue placerat cursus. Curabitur id velit molestie, placerat risus et, pretium sem. Sed tincidunt turpis erat, non sollicitudin mi ullamcorper at. Donec ullamcorper lectus orci, vitae rutrum libero dignissim vel. Aliquam erat volutpat.\r\n\r\nVestibulum at venenatis ipsum. Nunc lacinia ipsum a malesuada venenatis. Cras nunc sapien, elementum eget ornare sit amet, ultricies vitae erat. Ut convallis diam lorem, vitae tristique arcu varius ut. Cras fermentum nisi in ante venenatis, vitae eleifend augue tincidunt. Quisque elementum ipsum nec tempus dignissim. Curabitur sit amet est in est porttitor posuere vitae eu odio. Sed hendrerit posuere elit et vestibulum. Quisque blandit eros lectus, quis euismod neque elementum eu. Nullam fermentum nec elit vel efficitur. Nullam aliquam nibh ut elit feugiat, a convallis tellus tempus. Praesent id diam molestie, semper dolor nec, commodo libero. Morbi efficitur efficitur turpis sit amet posuere.\r\n\r\nQuisque auctor tempus enim ut laoreet. Sed nec lacus nisi. Nulla sodales neque diam, dignissim posuere nisi ornare sit amet. Morbi eleifend tellus dapibus varius malesuada. Sed venenatis orci enim, ut eleifend tellus bibendum sit amet. Nam volutpat quis leo eu lobortis. Sed placerat metus et lacus sollicitudin, eget sollicitudin tellus tristique. Curabitur a mi leo. Quisque tempus purus dignissim, finibus purus eu, tempor felis. Nam placerat tellus vitae pellentesque suscipit.\r\n\r\nDonec tristique hendrerit leo ac vehicula. Pellentesque aliquam lorem quis urna imperdiet, accumsan porta urna condimentum. Aenean nec libero purus. Quisque eu mollis turpis. Quisque vitae lectus euismod, vestibulum felis sit amet, ullamcorper nisl. Phasellus id nulla dui. Integer vel odio elementum, euismod tortor et, eleifend leo. Nulla est ante, maximus in massa sed, dignissim lobortis massa. Quisque ut molestie sem. Vestibulum sed mauris dictum, iaculis felis a, fringilla sapien. Cras accumsan purus ac gravida rhoncus. Donec quis dolor dapibus, egestas sem vel, molestie quam. Morbi et aliquet nunc, in scelerisque neque. Nam pulvinar vitae ex eu interdum. Donec vel auctor enim, id efficitur urna. Ut nisi leo, aliquam sed orci nec, commodo tempor quam.\r\n\r\nProin ex massa, eleifend non gravida eget, cursus at libero. Sed vulputate, turpis vel tincidunt molestie, est sapien tristique libero, eu dignissim mi nisi in magna. Mauris ornare augue in mi porta, quis rutrum lacus imperdiet. Suspendisse potenti. Aenean egestas, velit sit amet egestas interdum, massa turpis suscipit metus, ac convallis massa leo sit amet lorem. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, enim at feugiat efficitur, augue nisi porttitor ex, quis pretium elit odio non orci. Nam consequat metus justo, sit amet tristique nunc bibendum sed. Sed convallis aliquet justo, ut molestie lacus aliquet vitae.\r\n\r\nAenean diam neque, semper posuere dapibus ac, malesuada a lacus. Maecenas commodo convallis pulvinar. Pellentesque eleifend volutpat leo sit amet convallis. Donec id ipsum vitae sapien laoreet luctus. Etiam nulla felis, consectetur sollicitudin malesuada a, facilisis vel dui. Suspendisse eget nibh semper, lobortis nisl et, blandit leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ac volutpat diam. Pellentesque cursus pharetra nunc dragon sit amet porta. Pellentesque aliquam eleifend elit, nec sagittis sem efficitur sit amet. Phasellus venenatis tellus id nulla dignissim, in lacinia neque dignissim. Nunc ultrices id orci ut tincidunt. Quisque vitae dignissim quam\r\n\r\n In eget quam tincidunt, fringilla tortor a, varius nisi. Phasellus eget eros lacus. Quisque mi nunc, consectetur vitae elementum ac, consequat eget lorem. Sed nec elit pulvinar, malesuada odio sit amet, sodales ante. Aliquam rutrum a purus eu condimentum. Nunc condimentum lorem sapien, eget dapibus ante imperdiet tempus. Nam sollicitudin, ante id accumsan consectetur, enim lorem mollis lectus, sit amet suscipit justo magna ut nisl. Sed venenatis sem mauris, nec vehicula nulla vehicula sit amet. Sed ornare sodales nisi ut laoreet.\r\n\r\nProin sagittis sagittis sapien mollis tincidunt. Cras imperdiet arcu vitae tellus rhoncus egestas. Nullam efficitur felis non nulla ultrices finibus. Suspendisse mattis justo vitae risus fringilla interdum non eu ipsum. Curabitur sem elit, malesuada sed facilisis quis, fringilla ut velit. Maecenas et tortor dolor. Suspendisse vel iaculis lectus. Suspendisse mollis tristique risus, quis maximus est congue ut. Ut nec metus ut libero mattis tincidunt nec a justo. Etiam vitae nulla aliquet velit venenatis tincidunt sit amet ut felis. Proin sagittis eros eu felis pharetra semper.\r\n\r\nNullam tellus risus, finibus id venenatis sed, pretium vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non mollis libero. Duis imperdiet ex at justo tincidunt dignissim. Nulla ac laoreet turpis. Curabitur mauris leo, consectetur molestie massa quis, condimentum efficitur ligula. Cras sit amet tincidunt felis. Sed auctor arcu dignissim felis tempor varius. Praesent venenatis, quam ac mollis lobortis, velit leo consectetur nunc, tempus vehicula justo tortor ut quam. In feugiat facilisis purus vitae vulputate. Duis nec libero turpis. Aliquam pulvinar faucibus nisi, in tempor orci finibus sit amet. Sed quis diam ac metus tempor finibus. Cras fringilla libero in dui luctus, vitae pharetra neque accumsan. Proin risus magna, mattis eu enim non, dictum fringilla lorem.\r\n\r\nQuisque mi dolor, imperdiet vitae velit sed, imperdiet auctor felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec dictum quam in justo ornare, sit amet eleifend nisi rhoncus. Vestibulum commodo dui justo, quis tincidunt turpis eleifend sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis nec nibh metus. Etiam consequat id neque sit amet pretium. Duis rutrum volutpat massa. Maecenas eu bibendum nisi, a gravida lorem. Ut sapien purus, convallis in bibendum et, sagittis et libero. Nullam id felis et orci finibus interdum ac sit amet sapien. Ut mi nulla, aliquet non eleifend ac, pellentesque vitae neque. Suspendisse potenti. Aliquam vel tortor ornare, rhoncus mauris quis, vulputate elit.\r\n\r\nUt eu odio sit amet velit condimentum efficitur ut nec diam. Duis sodales metus ut egestas tincidunt. Integer dictum libero vitae enim mollis mollis. Curabitur fermentum elementum ligula, sit amet rutrum urna gravida tincidunt. Etiam sapien mi, rhoncus non hendrerit sed, scelerisque placerat lorem. Ut sollicitudin massa nec ipsum condimentum, nec rhoncus felis malesuada. Nullam at viverra lorem. Ut venenatis tincidunt enim, non vulputate sem. Donec rhoncus pulvinar sagittis. Aliquam iaculis non orci fermentum tempor. Suspendisse potenti. Phasellus cursus dolor non libero rhoncus euismod. Nunc facilisis, mi vitae sodales iaculis, odio leo condimentum risus, vel accumsan nulla odio sit amet metus.\r\n\r\nNunc sollicitudin, sem a fringilla maximus, purus ipsum iaculis turpis, quis volutpat nibh ligula et arcu. Etiam a dolor quis augue ultricies elementum. Donec condimentum nisl et urna imperdiet ultricies feugiat eu eros. Nullam at dapibus ipsum, vitae mollis nisi. Fusce vel malesuada dolor. Nulla facilisi. Nam semper feugiat ipsum quis dictum. In hac habitasse platea dictumst. Duis ut pellentesque ante. Aliquam rhoncus, nisl in posuere fermentum, libero quam gravida mi, vitae malesuada nunc lorem at nisl. Praesent consectetur ante dui, luctus venenatis nibh aliquam sit amet. Phasellus sed mauris iaculis, fringilla nisi eget, fermentum mi.\r\n\r\nDonec a justo lacus. Maecenas placerat congue erat, eget dictum velit aliquam at. Suspendisse potenti. Sed eros tellus, gravida eget metus eu, scelerisque egestas leo. Etiam auctor erat sed aliquet posuere. Cras dui sapien, tristique quis dignissim eu, semper in dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla eget nunc enim. Fusce pretium imperdiet purus et ultrices. ', '1', '0', '0000-00-00 00:00:00'),
(223, 50, 48, '2015-08-07 13:53:47', ' In eget quam tincidunt, fringilla tortor a, varius nisi. Phasellus eget eros lacus. Quisque mi nunc, consectetur vitae elementum ac, consequat eget lorem. Sed nec elit pulvinar, malesuada odio sit amet, sodales ante. Aliquam rutrum a purus eu condimentum. Nunc condimentum lorem sapien, eget dapibus ante imperdiet tempus. Nam sollicitudin, ante id accumsan consectetur, enim lorem mollis lectus, sit amet suscipit justo magna ut nisl. Sed venenatis sem mauris, nec vehicula nulla vehicula sit amet. Sed ornare sodales nisi ut laoreet.\r\n\r\nProin sagittis sagittis sapien mollis tincidunt. Cras imperdiet arcu vitae tellus rhoncus egestas. Nullam efficitur felis non nulla ultrices finibus. Suspendisse mattis justo vitae risus fringilla interdum non eu ipsum. Curabitur sem elit, malesuada sed facilisis quis, fringilla ut velit. Maecenas et tortor dolor. Suspendisse vel iaculis lectus. Suspendisse mollis tristique risus, quis maximus est congue ut. Ut nec metus ut libero mattis tincidunt nec a justo. Etiam vitae nulla aliquet velit venenatis tincidunt sit amet ut felis. Proin sagittis eros eu felis pharetra semper.\r\n\r\nNullam tellus risus, finibus id venenatis sed, pretium vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non mollis libero. Duis imperdiet ex at justo tincidunt dignissim. Nulla ac laoreet turpis. Curabitur mauris leo, consectetur molestie massa quis, condimentum efficitur ligula. Cras sit amet tincidunt felis. Sed auctor arcu dignissim felis tempor varius. Praesent venenatis, quam ac mollis lobortis, velit leo consectetur nunc, tempus vehicula justo tortor ut quam. In feugiat facilisis purus vitae vulputate. Duis nec libero turpis. Aliquam pulvinar faucibus nisi, in tempor orci finibus sit amet. Sed quis diam ac metus tempor finibus. Cras fringilla libero in dui luctus, vitae pharetra neque accumsan. Proin risus magna, mattis eu enim non, dictum fringilla lorem.\r\n\r\nQuisque mi dolor, imperdiet vitae velit sed, imperdiet auctor felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec dictum quam in justo ornare, sit amet eleifend nisi rhoncus. Vestibulum commodo dui justo, quis tincidunt turpis eleifend sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis nec nibh metus. Etiam consequat id neque sit amet pretium. Duis rutrum volutpat massa. Maecenas eu bibendum nisi, a gravida lorem. Ut sapien purus, convallis in bibendum et, sagittis et libero. Nullam id felis et orci finibus interdum ac sit amet sapien. Ut mi nulla, aliquet non eleifend ac, pellentesque vitae neque. Suspendisse potenti. Aliquam vel tortor ornare, rhoncus mauris quis, vulputate elit.\r\n\r\nUt eu odio sit amet velit condimentum efficitur ut nec diam. Duis sodales metus ut egestas tincidunt. Integer dictum libero vitae enim mollis mollis. Curabitur fermentum elementum ligula, sit amet rutrum urna gravida tincidunt. Etiam sapien mi, rhoncus non hendrerit sed, scelerisque placerat lorem. Ut sollicitudin massa nec ipsum condimentum, nec rhoncus felis malesuada. Nullam at viverra lorem. Ut venenatis tincidunt enim, non vulputate sem. Donec rhoncus pulvinar sagittis. Aliquam iaculis non orci fermentum tempor. Suspendisse potenti. Phasellus cursus dolor non libero rhoncus euismod. Nunc facilisis, mi vitae sodales iaculis, odio leo condimentum risus, vel accumsan nulla odio sit amet metus.\r\n\r\nNunc sollicitudin, sem a fringilla maximus, purus ipsum iaculis turpis, quis volutpat nibh ligula et arcu. Etiam a dolor quis augue ultricies elementum. Donec condimentum nisl et urna imperdiet ultricies feugiat eu eros. Nullam at dapibus ipsum, vitae mollis nisi. Fusce vel malesuada dolor. Nulla facilisi. Nam semper feugiat ipsum quis dictum. In hac habitasse platea dictumst. Duis ut pellentesque ante. Aliquam rhoncus, nisl in posuere fermentum, libero quam gravida mi, vitae malesuada nunc lorem at nisl. Praesent consectetur ante dui, luctus venenatis nibh aliquam sit amet. Phasellus sed mauris iaculis, fringilla nisi eget, fermentum mi.\r\n\r\nDonec a justo lacus. Maecenas placerat congue erat, eget dictum velit aliquam at. Suspendisse potenti. Sed eros tellus, gravida eget metus eu, scelerisque egestas leo. Etiam auctor erat sed aliquet posuere. Cras dui sapien, tristique quis dignissim eu, semper in dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla eget nunc enim. Fusce pretium imperdiet purus et ultrices dragon  In eget quam tincidunt, fringilla tortor a, varius nisi. Phasellus eget eros lacus. Quisque mi nunc, consectetur vitae elementum ac, consequat eget lorem. Sed nec elit pulvinar, malesuada odio sit amet, sodales ante. Aliquam rutrum a purus eu condimentum. Nunc condimentum lorem sapien, eget dapibus ante imperdiet tempus. Nam sollicitudin, ante id accumsan consectetur, enim lorem mollis lectus, sit amet suscipit justo magna ut nisl. Sed venenatis sem mauris, nec vehicula nulla vehicula sit amet. Sed ornare sodales nisi ut laoreet.\r\n\r\nProin sagittis sagittis sapien mollis tincidunt. Cras imperdiet arcu vitae tellus rhoncus egestas. Nullam efficitur felis non nulla ultrices finibus. Suspendisse mattis justo vitae risus fringilla interdum non eu ipsum. Curabitur sem elit, malesuada sed facilisis quis, fringilla ut velit. Maecenas et tortor dolor. Suspendisse vel iaculis lectus. Suspendisse mollis tristique risus, quis maximus est congue ut. Ut nec metus ut libero mattis tincidunt nec a justo. Etiam vitae nulla aliquet velit venenatis tincidunt sit amet ut felis. Proin sagittis eros eu felis pharetra semper.\r\n\r\nNullam tellus risus, finibus id venenatis sed, pretium vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non mollis libero. Duis imperdiet ex at justo tincidunt dignissim. Nulla ac laoreet turpis. Curabitur mauris leo, consectetur molestie massa quis, condimentum efficitur ligula. Cras sit amet tincidunt felis. Sed auctor arcu dignissim felis tempor varius. Praesent venenatis, quam ac mollis lobortis, velit leo consectetur nunc, tempus vehicula justo tortor ut quam. In feugiat facilisis purus vitae vulputate. Duis nec libero turpis. Aliquam pulvinar faucibus nisi, in tempor orci finibus sit amet. Sed quis diam ac metus tempor finibus. Cras fringilla libero in dui luctus, vitae pharetra neque accumsan. Proin risus magna, mattis eu enim non, dictum fringilla lorem.\r\n\r\nQuisque mi dolor, imperdiet vitae velit sed, imperdiet auctor felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec dictum quam in justo ornare, sit amet eleifend nisi rhoncus. Vestibulum commodo dui justo, quis tincidunt turpis eleifend sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis nec nibh metus. Etiam consequat id neque sit amet pretium. Duis rutrum volutpat massa. Maecenas eu bibendum nisi, a gravida lorem. Ut sapien purus, convallis in bibendum et, sagittis et libero. Nullam id felis et orci finibus interdum ac sit amet sapien. Ut mi nulla, aliquet non eleifend ac, pellentesque vitae neque. Suspendisse potenti. Aliquam vel tortor ornare, rhoncus mauris quis, vulputate elit.\r\n\r\nUt eu odio sit amet velit condimentum efficitur ut nec diam. Duis sodales metus ut egestas tincidunt. Integer dictum libero vitae enim mollis mollis. Curabitur fermentum elementum ligula, sit amet rutrum urna gravida tincidunt. Etiam sapien mi, rhoncus non hendrerit sed, scelerisque placerat lorem. Ut sollicitudin massa nec ipsum condimentum, nec rhoncus felis malesuada. Nullam at viverra lorem. Ut venenatis tincidunt enim, non vulputate sem. Donec rhoncus pulvinar sagittis. Aliquam iaculis non orci fermentum tempor. Suspendisse potenti. Phasellus cursus dolor non libero rhoncus euismod. Nunc facilisis, mi vitae sodales iaculis, odio leo condimentum risus, vel accumsan nulla odio sit amet metus.\r\n\r\nNunc sollicitudin, sem a fringilla maximus, purus ipsum iaculis turpis, quis volutpat nibh ligula et arcu. Etiam a dolor quis augue ultricies elementum. Donec condimentum nisl et urna imperdiet ultricies feugiat eu eros. Nullam at dapibus ipsum, vitae mollis nisi. Fusce vel malesuada dolor. Nulla facilisi. Nam semper feugiat ipsum quis dictum. In hac habitasse platea dictumst. Duis ut pellentesque ante. Aliquam rhoncus, nisl in posuere fermentum, libero quam gravida mi, vitae malesuada nunc lorem at nisl. Praesent consectetur ante dui, luctus venenatis nibh aliquam sit amet. Phasellus sed mauris iaculis, fringilla nisi eget, fermentum mi.\r\n\r\nDonec a justo lacus. Maecenas placerat congue erat, eget dictum velit aliquam at. Suspendisse potenti. Sed eros tellus, gravida eget metus eu, scelerisque egestas leo. Etiam auctor erat sed aliquet posuere. Cras dui sapien, tristique quis dignissim eu, semper in dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla eget nunc enim. Fusce pretium imperdiet purus et ultrices. ', '1', '0', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblprofessions`
--

CREATE TABLE IF NOT EXISTS `tblprofessions` (
  `professionID` int(11) NOT NULL,
  `professionName` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `cleanurl` varchar(128) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblprofessions`
--

INSERT INTO `tblprofessions` (`professionID`, `professionName`, `cleanurl`) VALUES
(0, 'Dyeing', 'dyeing'),
(1, 'Weaving', 'weaving'),
(2, 'Scribing', 'scribing'),
(3, 'Apothecary', 'apothecary');

-- --------------------------------------------------------

--
-- Table structure for table `tblquests`
--

CREATE TABLE IF NOT EXISTS `tblquests` (
  `questID` int(11) NOT NULL,
  `journalTitle` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `journalDesc` varchar(255) DEFAULT NULL,
  `isRepeatable` tinyint(1) NOT NULL,
  `childOf` int(11) DEFAULT NULL,
  `startItemsReceived` varchar(255) DEFAULT NULL,
  `itemsNeededForCompletion` varchar(255) DEFAULT NULL,
  `itemsReceivedOnCompletion` varchar(255) DEFAULT NULL,
  `whatIsRequiredForCompletion` varchar(128) NOT NULL,
  `titleGainedAfterCompletion` int(11) DEFAULT NULL,
  `thresholdNeededForCompletion` varchar(128) NOT NULL,
  `subQuestsRequiredForCompletion` varchar(128) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblquests`
--

INSERT INTO `tblquests` (`questID`, `journalTitle`, `journalDesc`, `isRepeatable`, `childOf`, `startItemsReceived`, `itemsNeededForCompletion`, `itemsReceivedOnCompletion`, `whatIsRequiredForCompletion`, `titleGainedAfterCompletion`, `thresholdNeededForCompletion`, `subQuestsRequiredForCompletion`) VALUES
(1, 'A hero''s journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '9', '9', '2x21/1x1/1x2/1x3', 'give', 4, '', NULL),
(2, 'An unexpected journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '9,14', 'world', NULL, '', NULL),
(3, 'A longer journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 1, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL),
(4, 'A hero''s peregrination', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '5,9', '5x19', '2x21,9', 'possess', 7, '', NULL),
(5, 'A much longer task', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', NULL, '2x21,9', 'multi', 7, '', '6,7'),
(6, 'sub task 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '', 'world', NULL, '', NULL),
(7, 'sub task 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblquestsstatus`
--

CREATE TABLE IF NOT EXISTS `tblquestsstatus` (
  `questStatusID` int(11) NOT NULL,
  `charID` int(11) DEFAULT NULL,
  `questID` int(11) DEFAULT NULL,
  `isUnderway` tinyint(1) NOT NULL DEFAULT '0',
  `thresholdAtQuestStart` varchar(255) DEFAULT NULL,
  `hasBeenActivated` tinyint(1) DEFAULT '0',
  `hasBeenCompleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblquestsstatus`
--

INSERT INTO `tblquestsstatus` (`questStatusID`, `charID`, `questID`, `isUnderway`, `thresholdAtQuestStart`, `hasBeenActivated`, `hasBeenCompleted`) VALUES
(1, 0, 0, 0, NULL, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblrecipes`
--

CREATE TABLE IF NOT EXISTS `tblrecipes` (
  `recipeID` int(11) NOT NULL,
  `components` varchar(255) DEFAULT NULL,
  `creates` int(11) DEFAULT NULL,
  `prerequisite` int(11) DEFAULT NULL,
  `profession` int(11) DEFAULT NULL,
  `recipeName` varchar(255) DEFAULT NULL,
  `recipeDescription` varchar(255) DEFAULT NULL,
  `defaultResultingColour` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblrecipes`
--

INSERT INTO `tblrecipes` (`recipeID`, `components`, `creates`, `prerequisite`, `profession`, `recipeName`, `recipeDescription`, `defaultResultingColour`) VALUES
(0, '11,mrdt,2', 12, 0, 0, NULL, '', 1),
(1, '11,mrdt,3', 12, 0, 0, NULL, '', 2),
(2, '11,mrdt,5', 12, 0, 0, NULL, '', 4),
(3, '11,mrdt,24', 7, 0, 0, NULL, '', NULL),
(4, '26,25', 28, 0, 0, NULL, '', NULL),
(5, '11,mrdt,6', 12, 0, 0, NULL, '', 16),
(6, 'dye,dye', 12, 0, 0, 'Mix dyes', 'Mix 2 or more dyes to create new colours.', NULL),
(7, '27', 26, 0, 0, 'Burn Wood', 'Produce Wood Ash by burning', NULL),
(8, '14,dye', 14, 0, 0, 'Dye Linen', 'Colour some linen.', NULL),
(9, '11,mrdt,23', 12, 0, 0, NULL, '', 6),
(10, '1', 14, 0, 1, NULL, '', NULL),
(11, '15', 16, 0, 1, NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblsavedsearches`
--

CREATE TABLE IF NOT EXISTS `tblsavedsearches` (
  `searchID` int(11) NOT NULL,
  `searchTerm` varchar(255) DEFAULT NULL,
  `searchCount` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=141 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblsavedsearches`
--

INSERT INTO `tblsavedsearches` (`searchID`, `searchTerm`, `searchCount`) VALUES
(1, 'crafting', 252),
(2, 'feeding pets', 252),
(3, 'image', 322),
(4, 'autumn', 248),
(5, 'autumn earth', 2),
(6, 'character development', 0),
(11, 'pte development', 0),
(8, 'pet development', 248),
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
(24, 'mail', 20),
(25, '78', 0),
(26, '78', 0),
(27, '78', 0),
(28, '107', 0),
(29, 'john', 2),
(30, 'pete', 0),
(31, 'pete', 0),
(32, 'bob', 0),
(33, 'bob', 0),
(34, 'petsss', 0),
(35, 'feed my pets', 0),
(36, 'feed-my-pets', 0),
(37, 'feed my lovely pet', 0),
(38, 'feed-my-lovely-pet', 0),
(39, 'images', 250),
(40, 'feeding my pets', 0),
(41, 'feeding-my-pets', 0),
(42, 'feeding-pets', 0),
(43, 'feeding-pets', 0),
(44, 'how does that work', 253),
(45, 'does that work', 248),
(46, 'dragon', 346),
(47, 'autumn earth', 0),
(48, 'autumn earth', 0),
(49, 'autumn earth', 0),
(50, 'autumn earth', 0),
(51, 'autumn earth', 0),
(52, 'autumn earth', 0),
(53, 'autumn earth', 0),
(54, 'autumn earth', 0),
(55, 'autumn earth', 0),
(56, 'autumn earth', 0),
(57, 'autumn earth', 0),
(58, 'autumn earth', 0),
(59, 'autumn earth', 0),
(60, 'autumn earth', 0),
(61, 'autumn earth', 0),
(62, 'autumn earth', 0),
(63, 'autumn earth', 0),
(64, 'autumn earth', 0),
(65, 'autumn earth', 0),
(66, 'autumn earth', 0),
(67, 'autumn earth', 0),
(68, 'autumn earth', 0),
(69, 'autumn earth', 0),
(70, 'autumn earth', 0),
(71, 'autumn earth', 0),
(72, 'autumn earth', 0),
(73, 'autumn earth', 0),
(74, 'autumn earth', 0),
(75, 'autumn earth', 0),
(76, 'autumn earth', 0),
(77, 'autumn earth', 0),
(78, 'autumn earth', 0),
(79, 'autumn earth', 0),
(80, 'autumn earth', 0),
(81, 'autumn earth', 0),
(82, 'autumn earth', 0),
(83, 'autumn earth', 0),
(84, 'autumn earth', 0),
(85, 'autumn earth', 0),
(86, 'autumn earth', 0),
(87, 'autumn earth', 0),
(88, 'autumn earth', 0),
(89, 'autumn earth', 0),
(90, 'autumn earth', 0),
(91, 'autumn earth', 0),
(92, 'autumn earth', 0),
(93, 'autumn earth', 0),
(94, 'autumn earth', 0),
(95, 'autumn earth', 0),
(96, 'autumn earth', 0),
(97, 'autumn earth', 0),
(98, 'autumn earth', 0),
(99, 'autumn earth', 0),
(100, 'autumn earth', 0),
(101, 'autumn earth', 0),
(102, 'autumn earth', 0),
(103, 'autumn earth', 0),
(104, 'autumn earth', 0),
(105, 'autumn earth', 0),
(106, 'autumn earth', 0),
(107, 'autumn earth', 0),
(108, 'autumn earth', 0),
(109, 'autumn earth', 0),
(110, 'autumn earth', 0),
(111, 'autumn earth', 0),
(112, 'autumn earth', 0),
(113, 'autumn earth', 0),
(114, 'autumn earth', 0),
(115, 'autumn earth', 0),
(116, 'autumn earth', 0),
(117, 'autumn earth', 0),
(118, 'autumn earth', 0),
(119, 'autumn earth', 0),
(120, 'autumn earth', 0),
(121, 'autumn earth', 0),
(122, 'autumn earth', 0),
(123, 'autumn earth', 0),
(124, 'autumn earth', 0),
(125, 'autumn earth', 0),
(126, 'autumn earth', 0),
(127, 'autumn earth', 0),
(128, 'autumn earth', 0),
(129, 'autumn earth', 0),
(130, 'autumn earth', 0),
(131, 'autumn earth', 0),
(132, 'autumn earth', 0),
(133, 'autumn earth', 0),
(134, 'autumn earth', 0),
(135, 'autumn earth', 0),
(136, 'autumn earth', 0),
(137, 'autumn earth', 0),
(138, 'autumn earth', 0),
(139, 'autumn earth', 0),
(140, 'dilly', 156);

-- --------------------------------------------------------

--
-- Table structure for table `tblsubscribedthreads`
--

CREATE TABLE IF NOT EXISTS `tblsubscribedthreads` (
  `subthreadID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `threadID` int(11) DEFAULT NULL,
  `status` char(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;

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
(41, 48, 38, '0'),
(42, 48, 39, '0'),
(43, 48, 40, '0'),
(44, 48, 41, '0'),
(45, 48, 42, '0'),
(46, 48, 43, '0'),
(47, 48, 44, '0'),
(48, 48, 45, '0'),
(49, 48, 46, '0'),
(50, 48, 47, '0'),
(51, 48, 48, '0'),
(52, 48, 49, '0'),
(53, 48, 50, '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

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
(30, 3, 13, 28, '2006-07-23 14:30:59', '2', '0', 'new thread :)', 'general-discussion/new-thread', 175, 6),
(31, 1, 5, 49, '2006-07-27 13:26:36', '2', '0', 'showing an image', 'bug-reports/showing-an-image', 208, 25),
(32, 3, 5, 43, '2006-08-13 11:07:19', '2', '0', 'john', 'general-discussion/john', 193, 2),
(33, 3, 5, 15, '2006-08-13 12:15:14', '2', '0', 'my title', 'general-discussion/my-title', 196, 1),
(34, 3, 5, 54, '2006-08-13 12:18:38', '2', '0', 'googlelink', 'general-discussion/googlelink', 207, 3),
(35, 3, 5, 20, '2006-08-13 12:22:03', '2', '0', 'l=img thread', 'general-discussion/l-img-thread', 209, 3),
(36, 2, 5, 27, '2007-05-08 18:33:13', '2', '0', 'crafting', 'suggestions/crafting', 206, 1),
(37, 3, 39, 1, '2015-06-30 16:50:43', '2', '0', 'dilly&#039;s here', 'general-discussion/dillys-here', 210, 1),
(38, 3, 48, 0, '2015-07-15 13:08:11', '2', '0', 'new one', 'general-discussion/new-one', 211, 1),
(39, 3, 48, 0, '2015-07-16 13:51:46', '2', '0', 'meow', 'general-discussion/meow', 212, 1),
(40, 2, 48, 0, '2015-07-17 15:36:48', '2', '0', 'meowww', 'suggestions/meowww', 213, 1),
(41, 3, 48, 0, '2015-07-17 15:39:03', '2', '0', 'mew', 'general-discussion/mew', 214, 1),
(42, 2, 48, 0, '2015-07-17 15:39:20', '2', '0', 'mew', 'suggestions/mew', 215, 1),
(43, 2, 48, 0, '2015-07-17 15:39:36', '2', '0', 'mew', 'suggestions/mew-2', 216, 1),
(44, 1, 48, 0, '2015-07-22 13:26:28', '2', '0', 'a really long title that is going to be too long to fit into the title tag', 'bug-reports/a-really-long-title-that-is-going-to-be-too-long-to-fit-into-the-title-tag', 217, 1),
(45, 1, 48, 0, '2015-08-06 10:39:31', '2', '0', 'dragon title', 'bug-reports/dragon-title', 218, 1),
(46, 3, 48, 0, '2015-08-06 10:42:11', '2', '0', 'lorem ip', 'general-discussion/lorem-ip', 219, 1),
(47, 2, 48, 0, '2015-08-06 10:42:31', '2', '0', 'dragon both', 'suggestions/dragon-both', 220, 1),
(48, 1, 48, 0, '2015-08-07 09:08:42', '2', '0', 'multiple in body', 'bug-reports/multiple-in-body', 221, 1),
(49, 1, 48, 0, '2015-08-07 13:21:23', '2', '0', 'massive post', 'bug-reports/massive-post', 222, 1),
(50, 2, 48, 1, '2015-08-07 13:53:47', '2', '0', 'hidden in the middle', 'suggestions/hidden-in-the-middle', 223, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbltitles`
--

CREATE TABLE IF NOT EXISTS `tbltitles` (
  `titleID` int(11) NOT NULL,
  `titleName` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbltitles`
--

INSERT INTO `tbltitles` (`titleID`, `titleName`) VALUES
(1, 'of Croft'),
(2, 'spider friend'),
(3, 'master craftsperson'),
(4, 'of Burntwood'),
(5, 'the fortunate'),
(6, 'collector'),
(7, 'expert collector'),
(8, 'card flipper');

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
-- Indexes for table `tblcards`
--
ALTER TABLE `tblcards`
  ADD PRIMARY KEY (`cardID`);

--
-- Indexes for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  ADD PRIMARY KEY (`charID`);

--
-- Indexes for table `tblcolours`
--
ALTER TABLE `tblcolours`
  ADD PRIMARY KEY (`colourID`);

--
-- Indexes for table `tblcontractbids`
--
ALTER TABLE `tblcontractbids`
  ADD PRIMARY KEY (`bidID`);

--
-- Indexes for table `tblcontracts`
--
ALTER TABLE `tblcontracts`
  ADD PRIMARY KEY (`contractID`);

--
-- Indexes for table `tbldungeonachievements`
--
ALTER TABLE `tbldungeonachievements`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `tbldungeonmapconfig`
--
ALTER TABLE `tbldungeonmapconfig`
  ADD PRIMARY KEY (`dungeonId`);

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
-- Indexes for table `tblitemcategories`
--
ALTER TABLE `tblitemcategories`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `tblitemgroups`
--
ALTER TABLE `tblitemgroups`
  ADD PRIMARY KEY (`itemGroupID`), ADD UNIQUE KEY `itemGroupCode` (`itemGroupCode`);

--
-- Indexes for table `tbllocations`
--
ALTER TABLE `tbllocations`
  ADD PRIMARY KEY (`locID`), ADD UNIQUE KEY `locID` (`locID`), ADD KEY `locID_2` (`locID`);

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
-- Indexes for table `tblplants`
--
ALTER TABLE `tblplants`
  ADD PRIMARY KEY (`plantID`);

--
-- Indexes for table `tblposts`
--
ALTER TABLE `tblposts`
  ADD PRIMARY KEY (`postID`);

--
-- Indexes for table `tblprofessions`
--
ALTER TABLE `tblprofessions`
  ADD PRIMARY KEY (`professionID`);

--
-- Indexes for table `tblquests`
--
ALTER TABLE `tblquests`
  ADD PRIMARY KEY (`questID`);

--
-- Indexes for table `tblquestsstatus`
--
ALTER TABLE `tblquestsstatus`
  ADD PRIMARY KEY (`questStatusID`);

--
-- Indexes for table `tblrecipes`
--
ALTER TABLE `tblrecipes`
  ADD PRIMARY KEY (`recipeID`);

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
-- Indexes for table `tbltitles`
--
ALTER TABLE `tbltitles`
  ADD PRIMARY KEY (`titleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblacct`
--
ALTER TABLE `tblacct`
  MODIFY `accountID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT for table `tblauctionbids`
--
ALTER TABLE `tblauctionbids`
  MODIFY `bidID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `tblauctionitems`
--
ALTER TABLE `tblauctionitems`
  MODIFY `auctionID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `tblcards`
--
ALTER TABLE `tblcards`
  MODIFY `cardID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  MODIFY `charID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `tblcolours`
--
ALTER TABLE `tblcolours`
  MODIFY `colourID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `tblcontractbids`
--
ALTER TABLE `tblcontractbids`
  MODIFY `bidID` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `tblcontracts`
--
ALTER TABLE `tblcontracts`
  MODIFY `contractID` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbldungeonachievements`
--
ALTER TABLE `tbldungeonachievements`
  MODIFY `index` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tbldungeonmapconfig`
--
ALTER TABLE `tbldungeonmapconfig`
  MODIFY `dungeonId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
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
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `tblitemcategories`
--
ALTER TABLE `tblitemcategories`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblitemgroups`
--
ALTER TABLE `tblitemgroups`
  MODIFY `itemGroupID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tbllocations`
--
ALTER TABLE `tbllocations`
  MODIFY `locID` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
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
  MODIFY `newsID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `tblplants`
--
ALTER TABLE `tblplants`
  MODIFY `plantID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=272;
--
-- AUTO_INCREMENT for table `tblposts`
--
ALTER TABLE `tblposts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=224;
--
-- AUTO_INCREMENT for table `tblprofessions`
--
ALTER TABLE `tblprofessions`
  MODIFY `professionID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tblquests`
--
ALTER TABLE `tblquests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tblquestsstatus`
--
ALTER TABLE `tblquestsstatus`
  MODIFY `questStatusID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tblrecipes`
--
ALTER TABLE `tblrecipes`
  MODIFY `recipeID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tblsavedsearches`
--
ALTER TABLE `tblsavedsearches`
  MODIFY `searchID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=141;
--
-- AUTO_INCREMENT for table `tblsubscribedthreads`
--
ALTER TABLE `tblsubscribedthreads`
  MODIFY `subthreadID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=54;
--
-- AUTO_INCREMENT for table `tblthreads`
--
ALTER TABLE `tblthreads`
  MODIFY `threadID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `tbltitles`
--
ALTER TABLE `tbltitles`
  MODIFY `titleID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
