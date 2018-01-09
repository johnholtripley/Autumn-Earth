-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2018 at 05:59 PM
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
(1, '2018-07-02 00:00:00', '2018-10-28 21:08:58', 13, 6, 4, -1, -1, 20, 0),
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
  `cardName` varchar(255) COLLATE utf8_bin NOT NULL,
  `cardCraftingCost` int(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcards`
--

INSERT INTO `tblcards` (`cardID`, `cardAttack`, `cardDefense`, `cardName`, `cardCraftingCost`) VALUES
(1, 5, 10, 'Bomb', 20),
(2, 5, 10, 'Chocobo', 20),
(3, 5, 10, 'Mog', 20),
(4, 5, 10, 'Cactuar', 20),
(5, 5, 10, 'Shiva', 30),
(6, 5, 10, 'Tonberry', 20),
(7, 5, 10, 'Slime', 20);

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
-- Table structure for table `tblcollectionquests`
--

CREATE TABLE IF NOT EXISTS `tblcollectionquests` (
  `collectionQuestID` int(11) NOT NULL,
  `collectionQuestName` varchar(128) NOT NULL,
  `cleanurl` varchar(128) NOT NULL,
  `collectionQuestLore` mediumtext NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcollectionquests`
--

INSERT INTO `tblcollectionquests` (`collectionQuestID`, `collectionQuestName`, `cleanurl`, `collectionQuestLore`) VALUES
(0, 'The Barrow Mines', 'the-barrow-mines', 'Thus they complained that he dwelt northmost of all a civil strife against rebels and anarchists within. In the earlier travellers; it is nothing to show that even there our discovery had ended, and that the siege must be connected with the sun and moon revolve, making day and saved the ship''s boat of Captain Gifford, and with Flanders, "while for the explorations made and to dress our need". '),
(1, 'The Anvil Plains', 'the-anvil-plains', 'After two years went by, King John and Philippa, in detail; the history of institutions there are two chief lords which have been profoundly different. For after all in Europe, of North Africa, of the world, where is so large, as it were Catholic mythology turned inside out and hung down even to Quito in Peru.');

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
(14, 'Celadon'),
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
-- Table structure for table `tblcreatures`
--

CREATE TABLE IF NOT EXISTS `tblcreatures` (
  `creatureID` int(11) NOT NULL,
  `creatureName` varchar(255) DEFAULT NULL,
  `creatureDescription` longtext,
  `creatureType` varchar(128) NOT NULL,
  `cleanURL` varchar(128) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcreatures`
--

INSERT INTO `tblcreatures` (`creatureID`, `creatureName`, `creatureDescription`, `creatureType`, `cleanURL`) VALUES
(0, 'Pilcrow', 'A black bird with a curious fascination for anything with writing on.', 'Bird', 'pilcrow'),
(1, 'Auroch', 'A surprisingly gentle herd animal given its enormous horns.', 'Animal', 'auroch'),
(2, 'Ellyll', 'The Ellyllon are delightful little fairy folk.', 'Spirit', 'ellyll'),
(3, 'Gobling', 'Anywhere underground, you''re bound to find some of these.', 'Denizen', 'gobling'),
(4, 'Eldritch', 'A dark, mischievous spirit. Worth avoiding if possible.', 'Spirit', 'eldritch'),
(5, 'Ghast', 'A malevolent trapped soul.', 'Spirit', 'ghast'),
(6, 'Guise', 'A shape shifter. ', 'Animal', 'guise'),
(7, 'Dwarrow', 'Stocky types who love mining.', 'Denizen', 'dwarrow'),
(8, 'Uldra', 'The Uldra (also called The Huldra, or Huldra-folk in some regions) are ancient beings.', 'Denizen', 'uldra'),
(9, 'Spriggan', 'A real mischevious type', 'Denizen', 'spriggan'),
(11, 'Inkling', 'No-one''s quite sure...', 'Denizen', 'inkling'),
(12, 'Draugar', 'A reanimated being.', 'Spirit', 'draugar'),
(13, 'Gnohm', 'Delightful little folk.', 'Denizen', 'gnohm'),
(14, 'Hydratid', 'Aquatic creature.', 'Animal', 'hydratid'),
(15, 'Tarasque', 'Semi aquatic serpentine dragon.', 'Animal', 'tarasque'),
(16, 'Fomorrah', 'Nether giant.', 'Animal', 'fomorrah');

-- --------------------------------------------------------

--
-- Table structure for table `tblcreaturetypes`
--

CREATE TABLE IF NOT EXISTS `tblcreaturetypes` (
  `creatureTypeId` int(11) NOT NULL,
  `creatureTypeName` varchar(255) DEFAULT NULL,
  `creatureTypeURL` varchar(128) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcreaturetypes`
--

INSERT INTO `tblcreaturetypes` (`creatureTypeId`, `creatureTypeName`, `creatureTypeURL`) VALUES
(0, 'Bird', 'bird'),
(1, 'Animal', 'animal'),
(2, 'Spirit', 'spirit'),
(3, 'Denizen', 'denizen'),
(4, 'Elemental', 'elemental');

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
  `eventStart` date DEFAULT NULL,
  `eventDurationDays` int(11) NOT NULL,
  `repeatsAnnually` tinyint(1) DEFAULT '0',
  `title` varchar(255) DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `eventContent` longtext NOT NULL,
  `cleanURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblevents`
--

INSERT INTO `tblevents` (`eventID`, `eventStart`, `eventDurationDays`, `repeatsAnnually`, `title`, `summary`, `eventContent`, `cleanURL`) VALUES
(2, '2000-08-01', 31, 1, 'Halloween', 'halloween event', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'halloween'),
(5, '2000-12-01', 31, 1, 'Christmas', 'happy christmas', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'christmas'),
(6, '2000-02-01', 28, 1, 'Valentines', 'valentines', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'valentines'),
(7, '2000-12-20', 73, 1, 'rolls over a year', 'weekend', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'weekend'),
(8, '2017-02-27', 2, 0, 'Special one off', 'special', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus commodo venenatis. Maecenas sed sem lorem. Nunc porta, lectus vel tincidunt luctus, dui risus bibendum ipsum, luctus efficitur turpis mauris vitae magna. Phasellus vitae efficitur dui. Aenean sed sagittis nibh, non malesuada magna. Proin faucibus vehicula dolor, at condimentum neque eleifend in. In sed odio vitae odio hendrerit aliquam eleifend sit amet nisi. Morbi ac erat vel enim pretium molestie suscipit sed lorem. Vestibulum in mauris et purus accumsan fermentum.  Praesent quis tempor urna. Quisque a libero ac ex tincidunt interdum quis non libero. Duis nec diam a velit sollicitudin ultrices vel eu metus. Duis at risus eget augue gravida finibus. Phasellus sed elit turpis. Phasellus fringilla orci id libero ullamcorper, euismod sagittis sapien ultrices. Ut sollicitudin elit non lectus pellentesque, ut faucibus lorem hendrerit. Suspendisse a elementum eros. Fusce sit amet metus enim. Quisque at velit nulla. Nunc rutrum justo sit amet tristique ultricies. Maecenas a purus quis libero interdum ultricies. In ligula mi, ornare non iaculis at, condimentum sed elit. Fusce pretium, dui sit amet molestie pellentesque, tortor massa sollicitudin purus, vitae tempor nisl ante vel nisl. ', 'special');

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
(1, '1', '&lt;P&gt;stuff&lt;/P&gt;\n&lt;P&gt;more stuff&lt;/P&gt;\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'guild page #1', 'guild-page-1', 1, '1', '2006-07-23 00:00:00', 'Georgia, ''Times New Roman'', Times, serif'),
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
  `spriteWidth` int(11) DEFAULT NULL,
  `spriteHeight` int(11) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `actionValue` varchar(128) NOT NULL,
  `dyeable` tinyint(1) NOT NULL,
  `level` int(11) NOT NULL,
  `prerequisites` varchar(255) NOT NULL,
  `itemGroup` varchar(10) NOT NULL,
  `itemCategories` varchar(128) DEFAULT NULL,
  `racialPreference` varchar(128) DEFAULT NULL,
  `inscribable` tinyint(1) NOT NULL,
  `colour` int(128) NOT NULL,
  `hasInherentColour` tinyint(1) NOT NULL DEFAULT '0',
  `showInTheCodex` tinyint(1) NOT NULL DEFAULT '1',
  `lockedToThisPlayer` tinyint(1) NOT NULL DEFAULT '0',
  `respawnRate` int(11) DEFAULT NULL,
  `activeDuringSeason` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblinventoryitems`
--

INSERT INTO `tblinventoryitems` (`itemID`, `shortname`, `description`, `priceCode`, `centreX`, `centreY`, `width`, `height`, `spriteWidth`, `spriteHeight`, `cleanURL`, `action`, `actionValue`, `dyeable`, `level`, `prerequisites`, `itemGroup`, `itemCategories`, `racialPreference`, `inscribable`, `colour`, `hasInherentColour`, `showInTheCodex`, `lockedToThisPlayer`, `respawnRate`, `activeDuringSeason`) VALUES
(1, 'Wild Flax', '-', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'wild-flax', '', '0', 0, 0, '0', '0', '1', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(2, 'Wild Madder', 'A flower used for its red pigment.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'wild-madder', '', '0', 0, 0, '0', '0', '1', NULL, 0, 1, 1, 1, 0, NULL, NULL),
(3, 'Safflower', 'A flower used for its yellow pigment.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'safflower', '', '0', 0, 0, '0', '0', '1', NULL, 0, 2, 1, 1, 0, NULL, NULL),
(5, 'Whortleberry', 'The berries are used for their blue colour.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'whortleberry', '', '0', 0, 0, '0', '0', '1', NULL, 0, 4, 1, 1, 0, NULL, NULL),
(6, 'Meadowsweet', 'Used to make black pigments.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'meadowsweet', '', '0', 0, 0, '0', '0', '1', NULL, 0, 16, 1, 1, 0, NULL, NULL),
(7, 'Archil', 'A purple dye.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'archil', '', '0', 1, 0, '0', 'dye', '2', NULL, 0, 5, 1, 1, 0, NULL, NULL),
(8, 'Copper Mordant', 'A standard mordant.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'copper-mordant', '', '0', 0, 0, '0', 'mrdt', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(9, 'Iron Mordant', 'A mordant for making darker dyes.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'iron-mordant', '', '0', 0, 0, '0', 'mrdt', '2', NULL, 0, 16, 1, 1, 0, NULL, NULL),
(10, 'Alum Mordant', 'A mordant used for brighter dyes.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'alum-mordant', '', '0', 0, 0, '0', 'mrdt', '2', NULL, 0, 8, 1, 1, 0, NULL, NULL),
(11, 'Small Glass Bottle', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'small-glass-bottle', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(12, 'Dye', 'A standard pigment dye.', '4', '20.0', '24.0', 0, 0, NULL, NULL, 'dye', '', '0', 1, 0, '0', 'dye', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(13, 'Dyer''s Cauldron', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'dyers-cauldron', 'craft', '0', 0, 0, '0', '0', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(14, 'Linen', 'A useful fabric.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'linen', '', '0', 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(15, 'Wool', 'Basic wool, unspun.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'wool', '', '0', 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(16, 'Woolen Yarn', 'Spun wool.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'yarn', '', '0', 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(17, 'Small Backpack', 'A 20 slot bag', '2', '20.0', '24.0', 0, 0, NULL, NULL, 'small-backpack', 'bag', '20', 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(18, 'Barrel', 'A large wooden barrel.', '2', '25.0', '31.0', 38, 38, NULL, NULL, 'barrel', 'static', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(19, 'Pumpkin', 'A tasty pumpkin.', '1', '16.0', '18.0', 25, 23, NULL, NULL, 'pumpkin', '', '0', 0, 0, '0', '0', '4', NULL, 0, 0, 0, 1, 0, NULL, 2),
(20, 'Large Backpack', 'A 24 slot bag', '2', '20.0', '24.0', 0, 0, NULL, NULL, 'large-backpack', 'bag', '24', 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(21, 'Totem Card Pack', '5 cards', '4', '20.0', '24.0', 0, 0, NULL, NULL, 'card-pack', 'booster', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(22, 'Standing Stone', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'standing-stone', 'questToggle', '2', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(23, 'Mugwort', 'Used to make green dyes', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'mugwort', '', '0', 0, 0, '0', '0', '1', NULL, 0, 6, 1, 1, 0, NULL, NULL),
(24, 'Rim Lichen', 'Used to make purple dyes', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'rim-lichen', '', '0', 0, 0, '0', '0', '1', NULL, 0, 5, 1, 1, 0, NULL, NULL),
(25, 'Spring water', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'spring-water', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(26, 'Wood Ash', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'wood-ash', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(27, 'Apple Wood', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'apple-wood', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(28, 'Lye', 'Used for bleaching', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'lye', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 8, 1, 1, 0, NULL, NULL),
(29, 'Green Dye Recipe', 'Learn how to make a green dye.', '4', '49.0', '81.0', 63, 63, NULL, NULL, '', 'recipe', '9', 0, 0, '0', 'scribe', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(30, 'Weaver''s Loom', 'Tools for weaving and tailoring', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'weavers-loom', 'craft', '1', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(31, 'Wrapped gift', 'Double click to see what''s inside. Contains: ##contains##', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'wrapped-gift', 'container', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(32, 'Book', '', '4', '12.0', '6.0', 20, 13, NULL, NULL, 'book', 'book', '0', 0, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 0, NULL, NULL),
(33, 'Parchment', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'parchment', 'book', '0', 0, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 0, NULL, NULL),
(34, 'Chocobo Card', 'A chocobo card. Pweeeek!', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'card-chocobo', 'card', '2', 0, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(35, 'Wild Flax Node', '', '4', '19.0', '39.0', 20, 20, NULL, NULL, 'wild-flax-node', 'node', '0', 0, 0, '0', '0', '5', NULL, 0, 0, 0, 0, 0, 300, NULL),
(36, 'Chocobo Gold Card', 'A rare chocobo card. Pweeeek!', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'card-gold-chocobo', 'card', '-2', 0, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(37, 'Copperas', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'copperas', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(38, 'Acacia Resin', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'acacia-resin', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(39, 'Iron Gall', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'iron-gall', '', '0', 0, 0, '0', '0', NULL, NULL, 0, 16, 1, 1, 0, NULL, NULL),
(40, 'Ink', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 'ink', '', '0', 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(41, 'Scribe''s Quill', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'scribes-quill', 'inscribe', '0', 0, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(42, 'Inner Door Lever', '', '1', '35.0', '35.0', 33, 33, 56, 45, 'inner-door-lever', 'toggleInnerDoor', '0', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(43, 'Inner Door Key', '', '1', '10.0', '6.0', 12, 12, NULL, NULL, 'inner-door-key', 'key', '0', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(44, 'Ammonite', 'Fossilised mollusc', '1', '25.0', '31.0', 38, 38, NULL, NULL, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(45, 'Echinoid', 'Fossilised sea urchin', '1', '25.0', '31.0', 38, 38, NULL, NULL, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(46, 'Crinoid', 'Fossilised coral', '1', '25.0', '31.0', 38, 38, NULL, NULL, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(47, 'Butterfly plant', '', '4', '19.0', '39.0', 20, 20, NULL, NULL, 'butterfly-plant', 'nest', '0', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, 300, NULL),
(48, 'Chest', '', '1', '44.0', '44.0', 48, 48, NULL, NULL, 'chest', 'chest', '6', 0, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(49, 'Worsted Yarn', 'Thicker, spun wool.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 'yarn', '', '0', 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=442 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
(271, 'Beckia crocardamine', 'Riverholly, Stavebeam or Pouchpurse', 'A rare creeping native perennial of dry grassland and roadside, with dark red flowers. An excellent nector plant and a caterpillar food plant for the Silken processionary butterfly. Height: 10-40cm (4-16in) Perennial: Flowers May to Sept. Contains plant toxins.', 'beckia-crocardamine', 'Beckia crocardamine\r\n(Riverholly, Stavebeam or Pouchpurse)', 0, 0, '2016-11-18 10:03:15', 1479495853, 'Riverholly/Stavebeam/Pouchpurse'),
(272, 'Lutivum coryda', 'Honeystrife', 'The beautiful, bright light red daisy flowers of this annual were once a common sight in hedgerows and pathways. It is now much rarer due to widespread use of selective herbicides.', 'lutivum-coryda', 'Lutivum coryda\r\n(Honeystrife)', 0, 0, '2017-01-25 11:50:25', 1485419349, 'Honeystrife'),
(273, 'Zyginia curculacinia', 'Skywort, Wimplerose or Downholly', 'A shimmering, bright perennial found growing on cornfields and waste places. The leaves are prized in cookery. The roots are particularly attractive to bumble bee.', 'zyginia-curculacinia', 'Zyginia curculacinia\r\n(Skywort, Wimplerose or Downholly)\r\nA shimmering, bright perennial found growing on cornfields and waste places.', 0, 0, '2017-01-25 11:50:38', 1485378641, 'Skywort/Wimplerose/Downholly'),
(274, 'Hanium curculum', 'Bitterfoot or Ridgeseed', 'A dark red flower of disturbed ground, farm land and walls. Likes calcareous soils.', 'hanium-curculum', 'Hanium curculum\r\n(Bitterfoot or Ridgeseed)\r\nA dark red flower of disturbed ground, farm land and walls. Likes calcareous soils.', 0, 0, '2017-04-10 13:50:31', 1491881113, 'Bitterfoot/Ridgeseed'),
(275, 'Xicoryda niachille', 'Hearthfern', 'A native biennial with creeping stems, common in ditches, marshes, pond edges, and river banks.', 'xicoryda-niachille', 'Xicoryda niachille\r\n(Hearthfern)\r\nA native biennial with creeping stems, common in ditches, marshes, pond edges, and river banks.', 0, 0, '2017-06-13 13:21:24', 1497405393, 'Hearthfern'),
(276, 'Virginia concanata', 'Pouchwhistle', 'A native biennial commonly found in England and Wales, usually on light soils, in open woods, grassland and hedgerows.', 'virginia-concanata', 'Virginia concanata\r\n(Pouchwhistle)', 0, 0, '2017-07-21 16:01:05', 1500709523, 'Pouchwhistle'),
(277, 'Rhantemelanchier cladrastis', 'Dragonsgrass, Heath lichen or Trailing goldenthistle', 'Widely used in days gone by to curdle milk for cheese making.', 'rhantemelanchier-cladrastis', 'Rhantemelanchier cladrastis\r\n(Dragonsgrass, Heath lichen or Trailing goldenthistle)', 0, 0, '2017-07-21 16:01:23', 1500658341, 'Dragonsgrass/Heath lichen/Trailing goldenthistle'),
(278, 'Solanum niacama', 'Motherswhorl, Spindlewhistle or Hengease', 'The delightful bright red daisy flowers of this biennial were once a common sight in cornfields and waste places. It is now much rarer due to widespread use of selective herbicides.', 'solanum-niacama', 'Solanum niacama\r\n(Motherswhorl, Spindlewhistle or Hengease)', 0, 0, '2017-09-18 15:32:55', 1505820661, 'Motherswhorl/Spindlewhistle/Hengease'),
(279, 'Rosmatis helium', 'Scarletwort or Autumnflax', 'Seeds itself very prolifically and is related to other campions.', 'rosmatis-helium', 'Rosmatis helium\r\n(Scarletwort or Autumnflax)\r\nSeeds itself very prolifically and is related to other campions.', 0, 0, '2017-09-18 15:33:02', 1505842002, 'Scarletwort/Autumnflax'),
(280, 'Ringaris tulatago', 'Panscelandine, Brightyarrow or Duskcomb', 'A common night flowering plant pollinated by bats and moths. Particularly favoured by the Meadow dryad moth.', 'ringaris-tulatago', 'Ringaris tulatago\r\n(Panscelandine, Brightyarrow or Duskcomb)\r\nA common night flowering plant pollinated by bats and moths.', 0, 1, '2017-11-08 10:08:32', 1510147873, 'Panscelandine/Brightyarrow/Duskcomb'),
(281, 'Nothamnus phormicamara', 'Greater kingsbloom', 'A native biennial with creeping stems, common in woods, hedges, pastures, heaths and rocky areas.', 'nothamnus-phormicamara', 'Nothamnus phormicamara\r\n(Greater kingsbloom)\r\nA native biennial with creeping stems, common in woods, hedges, pastures, heaths and rocky areas.', 0, 0, '2017-11-09 14:10:03', 1510312005, 'Greater kingsbloom'),
(282, 'Rydaminea rotago', 'Icebeam', 'Icebeams are the food plants of the caterpillars of the Ghost ermine butterfly.', 'rydaminea-rotago', 'Rydaminea rotago\r\n(Icebeam)\r\nIcebeams are the food plants of the caterpillars of the Ghost ermine butterfly.', 0, 0, '2017-11-09 14:11:01', 1510275286, 'Icebeam'),
(283, 'Ticillanum doxalis', 'Lownip', 'Seeds itself very prolifically and is related to other campions.', 'ticillanum-doxalis', 'Ticillanum doxalis\r\n(Lownip)\r\nSeeds itself very prolifically and is related to other campions.', 0, 0, '2017-11-09 14:11:09', 1510247945, 'Lownip'),
(284, 'Rhantemisium coryda', 'Glorycampion', 'Glorycampions are the food plants of the caterpillars of the Marbled dart butterfly.', 'rhantemisium-coryda', 'Rhantemisium coryda\r\n(Glorycampion)\r\nGlorycampions are the food plants of the caterpillars of the Marbled dart butterfly.', 0, 0, '2017-11-09 14:11:17', 1510244799, 'Glorycampion'),
(285, 'Rydalis bliteum', 'Fallow lichen or Lichoats', 'A beautiful, bright annual found growing on hedgerows and pathways. The flowers are prized in cookery. The roots are particularly attractive to the Brimstone gypsy butterfly.', 'rydalis-bliteum', 'Rydalis bliteum\r\n(Fallow lichen or Lichoats)\r\nA beautiful, bright annual found growing on hedgerows and pathways. The flowers are prized in cookery. The roots are particularly attractive to the Brimstone gypsy butterfly.', 0, 0, '2017-11-09 14:11:29', 1510251480, 'Fallow lichen/Lichoats'),
(286, 'Fraxinus dinginia', 'Autumn sunshade, Hawbloom or Mirecorn', 'Seeds itself very prolifically and is related to other campions.', 'fraxinus-dinginia', 'Fraxinus dinginia\r\n(Autumn sunshade, Hawbloom or Mirecorn)\r\nSeeds itself very prolifically and is related to other campions.', 0, 0, '2017-12-07 14:07:24', 1512723386, 'Autumn sunshade/Hawbloom/Mirecorn'),
(287, 'Beckiaridalis crocarda', 'Nighttresses', 'A common night flowering plant pollinated by bats and moths. Particularly favoured by the Frosted dart moth.', 'beckiaridalis-crocarda', 'Beckiaridalis crocarda\r\n(Nighttresses)\r\nA common night flowering plant pollinated by bats and moths. Particularly favoured by the Frosted dart moth.', 0, 1, '2018-01-03 15:08:31', 1515010870, 'Nighttresses'),
(288, 'Asclepias micaroticilla', 'Gladetea', 'A rare creeping native biennial of dry grassland and roadside, with yellow flowers. An excellent nector plant and a caterpillar food plant for the Ragged grayling butterfly. Height: 10-40cm (4-16in) Perennial: Flowers May to Sept. Contains plant toxins.', 'asclepias-micaroticilla', 'Asclepias micaroticilla\r\n(Gladetea)\r\nA rare creeping native biennial of dry grassland and roadside, with yellow flowers. An excellent nector plant and a caterpillar food plant for the Ragged grayling butterfly. Height: 10-40cm (4-16in) Perennial: Flowers ', 0, 0, '2018-01-03 15:08:43', 1514995550, 'Gladetea'),
(289, 'Crostidus mygdalis', 'Mistrefoil', 'Widely used in days gone by to curdle milk for cheese making.', 'crostidus-mygdalis', 'Crostidus mygdalis\r\n(Mistrefoil)\r\nWidely used in days gone by to curdle milk for cheese making.', 0, 0, '2018-01-04 13:34:36', 1515163353, 'Mistrefoil'),
(290, 'Gluticilla lutinata', 'Purpledown', 'A tall, widespread, native perennial, common in woods, hedges, pastures, heaths and rocky areas. The fluffy pale red flowers are the earliest flowering of the common hedge bank parsleys.', 'gluticilla-lutinata', 'Gluticilla lutinata\r\n(Purpledown)\r\nA tall, widespread, native perennial, common in woods, hedges, pastures, heaths and rocky areas. The fluffy pale red flowers are the earliest flowering of the common hedge bank parsleys.', 0, 0, '2018-01-04 13:37:44', 1515165417, 'Purpledown'),
(291, 'Papposum cladrastis', 'Oceanfrage', 'A widely occuring sea dwelling plant.', 'papposum-cladrastis', 'Papposum cladrastis\r\n(Oceanfrage)\r\nA widely occuring sea dwelling plant.', 1, 0, '2018-01-04 13:38:01', 1515147430, 'Oceanfrage'),
(292, 'Damicana nosalix', 'Lesser millersnut, Wild covensalv and by apothecaries, Oceansnare', 'A widely occuring sea dwelling plant.', 'damicana-nosalix', 'Damicana nosalix\r\n(Lesser millersnut, Wild covensalv and by apothecaries, Oceansnare)\r\nA widely occuring sea dwelling plant.', 1, 0, '2018-01-04 13:38:11', 1515093001, 'Lesser millersnut/Wild covensalve/Oceansnare'),
(293, 'Millea jacoperviria', 'Dream iris', 'A widely occuring creeping native perennial of dry grassland and roadside, with yellow flowers. An excellent nector plant and a caterpillar food plant for the Dark witch butterfly. Height: 10-40cm (4-16in) Perennial: Flowers May to Sept. Contains plant toxins.', 'millea-jacoperviria', 'Millea jacoperviria\r\n(Dream iris)\r\nA widely occuring creeping native perennial of dry grassland and roadside, with yellow flowers. An excellent nector plant and a caterpillar food plant for the Dark witch butterfly. Height: 10-40cm (4-16in) Perennial: Flo', 0, 0, '2018-01-04 13:38:55', 1515074595, 'Dream iris'),
(294, 'Cladrastis solamisicum', 'Wildtethe and by apothecaries, Springstem', 'Widely used in days gone by to curdle milk for cheese making.', 'cladrastis-solamisicum', 'Cladrastis solamisicum\r\n(Wildtethe and by apothecaries, Springstem)\r\nWidely used in days gone by to curdle milk for cheese making.', 0, 0, '2018-01-04 13:39:23', 1515143287, 'Wildtether/Springstem'),
(295, 'Lensolanum flavulanum', 'Wild mineoats, and by apothecaries, Solarbeam', 'Wild mineoatss are the food plants of the caterpillars of the Dusted brimstone butterfly.', 'lensolanum-flavulanum', 'Lensolanum flavulanum\r\n(Wild mineoats, and by apothecaries, Solarbeam)\r\nWild mineoatss are the food plants of the caterpillars of the Dusted brimstone butterfly.', 0, 0, '2018-01-04 13:39:51', 1515128175, 'Wild mineoats/Solarbeam'),
(296, 'Mentella barbata', 'Ironcorn, Royalstitch, and by apothecaries, Heathsleeves', 'A spreading native biennial, which produces long runners, which root at intervals to produce new plants. It produces a red flower and a sweet mini strawberry fruit. It is common in coastal areas and beside trade routes across Britain. It is the larval food plant of the Spined dagger butterfly.', 'mentella-barbata', 'Mentella barbata\r\n(Ironcorn, Royalstitch, and by apothecaries, Heathsleeves)\r\nA spreading native biennial, which produces long runners, which root at intervals to produce new plants. It produces a red flower and a sweet mini strawberry fruit.', 0, 0, '2018-01-04 13:40:30', 1515114529, 'Ironcorn/Royalstitch/Heathsleeves'),
(297, 'Tsussita cotinabinum', 'Flamethistle, Cragbough or Heathcelandine', 'A tall, widespread, native annual, common in ditches, marshes, pond edges, and river banks. The fluffy red flowers are the earliest flowering of the common hedge bank parsleys.', 'tsussita-cotinabinum', 'Tsussita cotinabinum\r\n(Flamethistle, Cragbough or Heathcelandine)\r\nA tall, widespread, native annual, common in ditches, marshes, pond edges, and river banks. The fluffy red flowers are the earliest flowering of the common hedge bank parsleys.', 0, 0, '2018-01-04 13:40:39', 1515147998, 'Flamethistle/Cragbough/Heathcelandine'),
(298, 'Hesperis flavulata', 'Hivemantle', 'A once common perennial weed of ditches, marshes, pond edges, and river banks, now rarely seen. The blue flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'hesperis-flavulata', 'Hesperis flavulata\r\n(Hivemantle)\r\nA once common perennial weed of ditches, marshes, pond edges, and river banks, now rarely seen. The blue flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 0, 0, '2018-01-04 13:40:48', 1515120757, 'Hivemantle'),
(299, 'Nuttallia barbarea', 'Echobroom', 'A tall, widespread, native biennial, common in coastal areas and beside trade routes. The fluffy red flowers are the earliest flowering of the common hedge bank parsleys.', 'nuttallia-barbarea', 'Nuttallia barbarea\r\n(Echobroom)\r\nA tall, widespread, native biennial, common in coastal areas and beside trade routes. The fluffy red flowers are the earliest flowering of the common hedge bank parsleys.', 0, 0, '2018-01-04 14:08:53', 1515089978, 'Echobroom'),
(300, 'Pubescens satichum', 'Sunbellows', 'A once common annual weed of hedgerows and pathways, now rarely seen. The red flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'pubescens-satichum', 'Pubescens satichum\r\n(Sunbellows)\r\nA once common annual weed of hedgerows and pathways, now rarely seen. The red flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 0, 0, '2018-01-04 14:11:54', 1515079087, 'Sunbellows'),
(301, 'Paeanamomum nosalix', 'Waxruff', 'A once common annual weed of woods and hedges, now rarely seen. The bright yellow flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'paeanamomum-nosalix', 'Paeanamomum nosalix\r\n(Waxruff)\r\nA once common annual weed of woods and hedges, now rarely seen. The bright yellow flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 0, 0, '2018-01-04 14:15:12', 1515100225, 'Waxruff'),
(302, 'Tissium cladrastis', 'Kingsflax, Marsh ghostfrond, and by apothecaries, Meadlance', 'A rare sea dwelling plant.', 'tissium-cladrastis', 'Tissium cladrastis\r\n(Kingsflax, Marsh ghostfrond, and by apothecaries, Meadlance)\r\nA rare sea dwelling plant.', 1, 0, '2018-01-04 14:16:07', 1515079394, 'Kingsflax/Marsh ghostfrond/Meadlance'),
(303, 'Brosiifolium crocarda', 'Bindmead', 'A scrambling annual commonly found in a wide variety of habitats including disturbed ground, farm land and walls.', 'brosiifolium-crocarda', 'Brosiifolium crocarda\r\n(Bindmead)\r\nA scrambling annual commonly found in a wide variety of habitats including disturbed ground, farm land and walls.', 0, 0, '2018-01-04 14:16:46', 1515159954, 'Bindmead'),
(304, 'Rydalis tinabinum', 'Fellstaff', 'A native biennial with creeping stems, common in woods and hedges.', 'rydalis-tinabinum', 'Rydalis tinabinum\r\n(Fellstaff)\r\nA native biennial with creeping stems, common in woods and hedges.', 0, 0, '2018-01-04 14:17:09', 1515167209, 'Fellstaff'),
(305, 'Rosmatis rhantemisium', 'Trailing milkbough', 'Seeds itself very prolifically and is related to other campions.', 'rosmatis-rhantemisium', 'Rosmatis rhantemisium\r\n(Trailing milkbough)\r\nSeeds itself very prolifically and is related to other campions.', 0, 0, '2018-01-04 14:17:42', 1515118334, 'Trailing milkbough'),
(306, 'Cinnacepa blitena', 'Called also Fairtether, Gladeclove or Eartlstrife', 'A delicately scented biennial wild flower. Flowers from June to August. Prolific in its production of flowers. Slightly fragrant and can be used as cut flowers.', 'cinnacepa-blitena', 'Cinnacepa blitena\r\n(Called also Fairtether, Gladeclove or Eartlstrife)\r\nA delicately scented biennial wild flower. Flowers from June to August. Prolific in its production of flowers. Slightly fragrant and can be used as cut flowers.', 0, 0, '2018-01-04 14:18:00', 1515134156, 'Fairtether/Gladeclove/Eartlstrife'),
(307, 'Lanchier gaeanadenta', 'It is likewise called Creepingflower', 'A native annual with creeping stems, common in disturbed ground, farm land and walls.', 'lanchier-gaeanadenta', 'Lanchier gaeanadenta\r\n(It is likewise called Creepingflower)\r\nA native annual with creeping stems, common in disturbed ground, farm land and walls.', 0, 0, '2018-01-04 14:31:22', 1515094943, 'Creepingflower'),
(308, 'Tronanas xicoryda', 'This is called by many as Gallowsthorn or Cornbrome', 'A delightful biennial rarely naturalised in woods and hedges. Its stalk is used as a main ingredient in various herbal remedies. The flowers open in the evening and are visited by a large number of Moth species.', 'tronanas-xicoryda', 'Tronanas xicoryda\r\n(This is called by many as Gallowsthorn or Cornbrome)\r\nA delightful biennial rarely naturalised in woods and hedges. Its stalk is used as a main ingredient in various herbal remedies.', 0, 0, '2018-01-04 14:32:01', 1515085098, 'Gallowsthorn/Cornbrome'),
(309, 'Gluticillanum densene', 'It is called Sleepwhorl or Grovemead', 'A once common biennial weed of disturbed ground, farm land and walls, now rarely seen. The bright yellow flowers are produced on tall wiry stems with narrow leaves from June to August. A good butterfly and bee plant.', 'gluticillanum-densene', 'Gluticillanum densene\r\n(It is called Sleepwhorl or Grovemead.)\r\nA once common biennial weed of disturbed ground, farm land and walls, now rarely seen. The bright yellow flowers are produced on tall wiry stems with narrow leaves from June to August. A good', 0, 0, '2018-01-04 14:32:40', 1515103468, 'Sleepwhorl/Grovemead'),
(310, 'Trilliamonense dermelanchier', 'It is likewise known as Sweet crest', 'A delightful annual found growing on hedgerows and pathways. The flowers are prized in cookery. The stalk is particularly attractive to the Mottled fritillary butterfly.', 'trilliamonense-dermelanchier', 'Trilliamonense dermelanchier\r\n(It is likewise known as Sweet crest).\r\nA delightful annual found growing on hedgerows and pathways. The flowers are prized in cookery. The stalk is particularly attractive to the Mottled fritillary butterfly.', 0, 0, '2018-01-04 14:33:05', 1515114630, 'Sweet crest'),
(311, 'Fulgigantea brassium', 'Abbeytruffle, Felsorrow; some call it Sweet hogmadder', 'BEING an inhabitant almost in every garden, it is so well known, that it needs no description.', 'fulgigantea-brassium', 'Fulgigantea brassium\r\n(Abbeytruffle, Felsorrow; some call it Sweet hogmadder).\r\nBEING an inhabitant almost in every garden, it is so well known, that it needs no description.', 0, 0, '2018-01-04 15:16:03', 1515090558, 'Abbeytruffle/Felsorrow/Sweet hogmadder'),
(312, 'Hanigrum curculum', 'Willowbrome', 'DIVERS sorts there are of this plant; the first of which is an Italian by birth, and only nursed up here in the gardens of the curious. Two or three sorts are found commonly growing wild here, the description of two of which I shall give you. The first is a smooth, low plant, not a foot high, very bitter in taste, with many square stalks, diversly branched from the bottom to the top, with divers joints, and two small leaves at each joint, broader at the bottom than they are at the end, a little dented about the edges, of a sad green colour, and full of veins. The flowers stand at the joints, being of a fair purple colour, with some white spots in them, in fashion like those of dead nettles. The seed is small and yellow, and the roots spread much under ground. The second seldom grows half a foot high, sending up many small branches, whereon grow many small leaves, set one against the other, somewhat broad, but very short. The flowers are like the flowers of the other fashion, but of a pale reddish colour. The seeds are small and yellowish. The root spreads like the other, neither will it yield to its fellow one ace of bitterness.', 'hanigrum-curculum', 'Hanigrum curculum\r\n(Willowbrome).\r\nDIVERS sorts there are of this plant; the first of which is an Italian by birth, and only nursed up here in the gardens of the curious. Two or three sorts are found commonly growing wild here, the description of two of w', 0, 0, '2018-01-04 15:16:18', 1515128054, 'Willowbrome'),
(313, 'Monenserotina multina', 'Also known as Covetresses, Greynettle; some call it Autumnleaf', 'A common sea dwelling plant.It grows more plentifully in Kent than any other county of this land, as namely, in many places on this side Dartford, along to Southfleet, Chatham, and Rochester, and upon Chatham down, hard by the Beacon, and half a mile from Rochester, in a field near a house called Selesys.For the most part they flower, and bear their berries late in the year, or not at all, although they are housed in Winter.Will you give me leave to be critical a little? I must take leave. Wormwood is an herb of Mars, and if Pontanus say otherwise, he is beside the bridge; I prove it thus: What delights in martial places, is a martial herb; but Wormwood delights in martial places (for about forges and iron works you may gather a cart-load of it,) _ergo_, it is a martial herb. It is hot and dry in the first degree, viz. just as hot as your blood, and no hotter. It remedies the evils choler can inflict on the body of man by sympathy. It helps the evils Venus and the wanton Boy produce, by antipathy; and it doth something else besides. It cleanses the body of choler (who dares say Mars doth no good?) It provokes urine, helps surfeits, or swellings in the belly; it causes appetite to meat, because Mars rules the attractive faculty in man: The sun never shone upon a better herb for the yellow jaundice than this; Why should men cry out so much upon Mars for an infortunate, (or Saturn either?) Did God make creatures to do the creation a mischief? This herb testifies, that Mars is willing to cure all diseases he causes; the truth is, Mars loves no cowards, nor Saturn fools, nor I neither. Take of the flowers of Wormwood, Rosemary, and Black Thorn, of each a like quantity, half that quantity of saffron; boil this in Rhenish wine, but put it not in saffron till it is almost boiled; This is the way to keep a manâ€™s body in health, appointed by Camerarius, in his book intitled _Hortus Medicus_, and it is a good one too. Besides all this, Wormwood provokes the terms. I would willingly teach astrologers, and make them physicians (if I knew how) for they are most fitting for the calling; if you will not believe me, ask Dr. Hippocrates, and Dr. Galen, a couple of gentlemen that our college of physicians keep to vapour with, not to follow. In this our herb, I shall give the pattern of a ruler, the sons of art rough cast, yet as near the truth as the men of Benjamin could throw a stone: Whereby, my brethren, the astrologers may know by a penny how a shilling is coined: As for the college of physicians, they are too stately to college or too proud to continue. They say a mouse is under the dominion of the Moon, and that is the reason they feed in the night; the house of the Moon is Cancer; rats are of the same nature with mice, but they are a little bigger; Mars receives his fall in Cancer, _ergo_, Wormwood being an herb of Mars, is a present remedy for the biting of rats and mice. Mushrooms (I cannot give them the title of Herba, Frutex, or Arbor) are under the dominion of Saturn, (and take one time with another, they do as much harm as good;) if any have poisoned himself by eating them, Wormwood, an herb of Mars, cures him, because Mars is exalted in Capricorn, the house of Saturn, and this it doth by sympathy, as it did the other by antipathy. Wheals, pushes, black and blue spots, coming either by bruises or beatings. Wormwood, an herb of Mars, helps, because Mars, (as bad you love him, and as you hate him) will not break your head, but he will give you a plaister. If he do but teach you to know yourselves, his courtesy is greater than his discourtesy. The greatest antipathy between the planets, is between Mars and Venus: one is hot, the other cold; one diurnal, the other nocturnal; one dry, the other moist; their houses are opposite, one masculine, the other feminine; one public, the other private; one is valiant, the other effeminate; one loves the light, the other hates it; one loves the field, the other sheets; then the throat is under Venus, the quinsy lies in the throat, and is an inflammation there; Venus rules the throat, (it being under Taurus her sign.) Mars eradicates all diseases in the throat by his herbs (for wormwood is one) and sends them to Egypt on an errand never to return more, this done by antipathy. The eyes are under the Luminaries; the right eye of a man, and the left eye of a woman the Sun claims dominion over: the left eye of a man, and the right eye of a woman, are privileges of the Moon, Wormwood, an herb of Mars cures both; what belongs to the Sun by sympathy, because he is exalted in his house; but what belongs to the Moon by antipathy, because he hath his fall in hers. Suppose a man be bitten or stung by a martial creature, imagine a wasp, a hornet, a scorpion, Wormwood, an herb of Mars, gives you a present cure; that Mars, choleric as he is, hath learned that patience, to pass by your evil speeches of him, and tells you by my pen, That he gives you no affliction, but he gives you a cure; you need not run to Apollo, nor Ã†sculapius; and if he was so choleric as you make him to be, he would have drawn his sword for anger, to see the ill conditions of these people that can spy his vices, and not his virtues. The eternal God, when he made Mars, made him for public good, and the sons of men shall know it in the latter end of the world. _Et cÃ¦lum Mars solus babet._ You say Mars is a destroyer; mix a little Wormwood, an herb of Mars, with your ink, neither rats nor mice touch the paper written with it, and then Mars is a preserver. Astrologers think Mars causes scabs and itch, and the virgins are angry with him, because wanton Venus told them he deforms their skins; but, quoth Mars, my only desire is, they should know themselves; my herb Wormwood will restore them to the beauty they formerly had, and in that I will not come an inch behind my opposite, Venus: for which doth the greatest evil, he that takes away an innate beauty, and when he has done, knows how to restore it again? or she that teaches a company of wanton lasses to paint their faces? If Mars be in a Virgin, in the nativity, they say he causes the cholic (it is well God hath set some body to pull down the pride of man.) He in the Virgin troubles none with the cholic, but them that know not themselves (for who knows himself, may easily know all the world.) Wormwood, an herb of Mars, is a present cure for it; and whether it be most like a Christian to love him for his good, or hate him for his evil, judge ye. I had almost forgotten, that charity thinks no evil. I was once in the Tower and viewed the wardrobe, and there was a great many fine clothes: (I can give them no other title, for I was never either linen or woolen draper) yet as brave as they looked, my opinion was that the moths might consume them; moths are under the dominion of Mars; this herb Wormwood being laid among cloaths, will make a moth scorn to meddle with the cloaths, as much as a lion scorns to meddle with a mouse, or an eagle with a fly. You say Mars is angry, and it is true enough he is angry with many countrymen, for being such fools to be led by the noses by the college of physicians, as they lead bears to Paris garden. Melancholy men cannot endure to be wronged in point of good fame, and that doth sorely trouble old Saturn, because they call him the greatest infortunate; in the body of man he rules the spleen, (and that makes covetous man so splenetic) the poor old man lies crying out of his left side. Father Saturnâ€™s angry, Mars comes to him; Come, brother, I confess thou art evil spoken of, and so am I; thou knowest I have my exaltation in thy house, I give him an herb of mine, Wormwood, to cure the old man: Saturn consented, but spoke little, and so Mars cured him by sympathy. When Mars was free from war, (for he loves to be fighting, and is the best friend a soldier hath) I say, when Mars was free from war, he called a council of war in his own brain, to know how he should do poor sinful man good, desiring to forget his abuses in being called an infortunate. He musters up his own forces, and places them in battalia. Oh! quoth he, why do I hurt a poor silly man or woman? His angel answers him, It is because they have offended their God, (Look back to Adam:) Well, says Mars, though they speak evil of me, I will do good to them; Deathâ€™s cold, my herb shall heat them: they are full of ill humours (else they would never have spoken ill of me;) my herb shall cleanse them, and dry them; they are poor weak creatures, my herb shall strengthen them; they are dull witted, my herb shall fortify their apprehensions; and yet among astrologers all this does not deserve a good word: Oh the patience of Mars! _Felix qui potuit rerum cognoscere caucas, Inque domus superum scandere cura facit._ O happy he that can the knowledge gain, To know the eternal God made nought in vain. To this I add, I know the reason causeth such a dearth Of knowledge; â€™tis because men love the earth. The other day Mars told me he met with Venus, and he asked her, What was the reason that she accused him for abusing women? He never gave them the pox. In the dispute they fell out, and in anger parted, and Mars told me that his brother Saturn told him, that an antivenerean medicine was the best against the pox. Once a month he meets with the Moon. Mars is quick enough of speech, and the Moon not much behind hand, (neither are most women.) The Moon looks much after children, and children are much troubled with the worms; she desired a medicine of him, he bid her take his own herb, Wormwood. He had no sooner parted with the Moon, but he met with Venus, and she was as drunk as a hog; Alas! poor Venus, quoth he; What! thou a fortune, and be drunk? Iâ€™ll give thee antipathetical cure; Take my herb Wormwood, and thou shall never get a surfeit by drinking. A poor silly countryman hath got an ague, and cannot go about his business: he wishes he had it not, and so do I; but I will tell him a remedy, whereby he shall prevent it; Take the herb of Mars, Wormwood, and if infortunes will do good, what will fortunes do? Some think the lungs are under Jupiter; and if the lungs then the breath; and though sometimes a man gets a stinking breath, and yet Jupiter is a fortune, forsooth; up comes Mars to him; Come brother Jupiter, thou knowest I sent thee a couple of trines to thy house last night, the one from Aries, and the other from Scorpio; give me thy leave by sympathy to cure this poor man with drinking a draught of Wormwood beer every morning. The Moon was weak the other day, and she gave a man two terrible mischiefs, a dull brain and a weak sight; Mars laid by his sword, and comes to her; Sister Moon, said he, this man hath angered thee, but I beseech thee take notice he is but a fool; prithee be patient, I will with my herb wormwood cure him of both infirmities by antipathy, for thou knowest thou and I cannot agree; with that the Moon began to quarrel; Mars (not delighting much in womenâ€™s tongues) went away, and did it whether she would or no. He that reads this, and understands what he reads, hath a jewel of more worth than a diamond; he that understands it not, is as little fit to give physick. There lies a key in these words which will unlock, (if it be turned by a wise hand) the cabinet of physick: I have delivered it as plain as I durst; it is not only upon Wormwood as I wrote, but upon all plants, trees, and herbs; he that understands it not, is unfit (in my opinion) to give physic. This shall live when I am dead. And thus I leave it to the world, not caring a farthing whether they like it or dislike it. The grave equals all men, and therefore shall equal me with all princes; until which time the eternal Providence is over me: Then the ill tongue of a prating fellow, or one that hath more tongue than wit, or more proud than honest, shall never trouble me. _Wisdom is justified by her children._ And so much for Wormwood.', 'monenserotina-multina', 'Monenserotina multina\r\n(Also known as Covetresses, Greynettle; some call it Autumnleaf).\r\nA common sea dwelling plant.', 1, 0, '2018-01-04 15:21:49', 1515114884, 'Covetresses/Greynettle/Autumnleaf'),
(314, 'Hispias bulbore', 'Also known as Morrowspray', 'This has larger leaves than those of the Self-heal, but else of the same fashion, or rather longer; in some green on the upper side, and in others more brownish, dented about the edges, somewhat hairy, as the square stalk is also which rises up to be half a yard high sometimes, with the leaves set by couples, from the middle almost, whereof upwards stand the flowers, together with many smaller and browner leaves than the rest, on the stalk below set at distance, and the stalk bare between them; among which flowers, are also small ones of a blueish and sometimes of an ash colour, fashioned like the flowers of Ground-ivy, after which come small, round blackish seeds. The root is composed of many strings, and spreads upon the ground. The white flowered Bugle differs not in form or greatness from the former, saving that the leaves and stalks are always green, and never brown, like the other, and the flowers thereof are white.They grow by ditches and water-sides, and in divers fields that are moist, for therein they chiefly delight to grow. The first generally through all the land, and the other but in some places. By the leave of my authors, I know the first grows in dry places.They flower in the end of June, and their seed is ripe in July.It is under the dominion of Saturn. A pugil of the flowers, which may be about a dram, (saith Dioscorides) drank twice a day in red wine, helps the lask, and bloody flux. It is an enemy to the nerves and sinews, being much taken inwardly, but very helpful to them, being outwardly applied. Pliny saith, the yellow berries are good against the jaundice; and taken before one be set to drink hard, preserves from drunkenness, and helps those that spit blood; and that the white berries being taken inwardly, or applied outwardly, kills the worms in the belly. The berries are a singular remedy to prevent the plague, as also to free them from it that have got it, by drinking the berries thereof made into a powder, for two or three days together. They being taken in wine, do certainly help to break the stone, provoke urine, and womenâ€™s courses. The fresh leaves of Ivy, boiled in vinegar, and applied warm to the sides of those that are troubled with the spleen, ache, or stitch in the sides, do give much ease: The same applied with some Rosewater, and oil of Roses, to the temples and forehead, eases the head-ache, though it be of long continuance. The fresh leaves boiled in wine, and old filthy ulcers hard to be cured washed therewith, do wonderfully help to cleanse them. It also quickly heals green wounds, and is effectual to heal all burnings and scaldings, and all kinds of exulcerations coming thereby, or by salt phlegm or humours in other parts of the body. The juice of the berries or leaves snuffed up into the nose, purges the head and brain of thin rheum that makes defluxions into the eyes and nose, and curing the ulcers and stench therein; the same dropped into the ears helps the old and running sores of them, those that are troubled with the spleen, shall find much ease by continual drinking out of a cup made of Ivy, so as the drink may stand some small time therein before it be drank. Cato saith, That wine put into such a cup, will soak through it, by reason of the antipathy that is between them. There seems to be a very great antipathy between wine and Ivy; for if one hath got a surfeit by drinking of wine, his speediest cure is to drink a draught of the same wine wherein a handful of Ivy leaves, being first bruised, have been boiled.', 'hispias-bulbore', 'Hispias bulbore\r\n(Also known as Morrowspray).', 0, 0, '2018-01-04 15:22:41', 1515136828, 'Morrowspray'),
(315, 'Hitinadenta puechina', 'Cornseed or Marsh goldenpod', 'A widely occuring sea dwelling plant.They grow almost every where in this land.They flower in March and April, and the fruit of the black is ripe in July and August.', 'hitinadenta-puechina', 'Hitinadenta puechina\r\n(Cornseed or Marsh goldenpod).\r\nA widely occuring sea dwelling plant.They grow almost every where in this land.They flower in March and April, and the fruit of the black is ripe in July and August.', 1, 0, '2018-01-04 15:22:57', 1515144543, 'Cornseed/Marsh goldenpod'),
(316, 'Rydaminegundo lobata', 'It is called Dragonsfrond', 'IT hath divers large leaves, long, and somewhat broad withal, like those of the greater plantain, but larger, thicker, of a greenish colour, somewhat blue withal. From among which leaves rises up a lusty stalk, three or four feet high, with divers leaves set thereon; the higher the stalk rises, the smaller are the leaves; at the top it spreads divers branches, at the end of which appear very pretty, little yellow flowers, and after they pass away like other flowers of the field, come husks, long and somewhat flat withal; in form they resemble a tongue, in colour they are black, and they hang bobbing downwards. The seed contained within these husks (if it be a little chewed) gives an azure colour. The root is white and long. It is usually planted in gardens, where, if it be suffered, it grows huge and great. The first flowers in December or January; the second in February or March.', 'rydaminegundo-lobata', 'Rydaminegundo lobata\r\n(It is called Dragonsfrond).\r\nIT hath divers large leaves, long, and somewhat broad withal, like those of the greater plantain, but larger, thicker, of a greenish colour, somewhat blue withal.', 0, 0, '2018-01-04 15:23:23', 1515149311, 'Dragonsfrond'),
(317, 'Fulginia crocarda', 'Also known as Marsh cuckoosnout, Willowbore or Wild bindpenny', 'A widely occuring sea dwelling plant. It grows on banks, or under hedges, through this land; the roots lie very deep. They flower in October and their seed is ripe quickly after.', 'fulginia-crocarda', 'Fulginia crocarda\r\n(Also known as Marsh cuckoosnout, Willowbore or Wild bindpenny).\r\nA widely occuring sea dwelling plant. It grows on banks, or under hedges, through this land; the roots lie very deep. They flower in October and their seed is ripe quickl', 1, 0, '2018-01-04 15:27:48', 1515152886, 'Marsh cuckoosnout/Willowbore/Wild bindpenny'),
(318, 'Vulgana ringaria', 'Hexthorn', 'This is so frequently known to be an inhabitant in almost every garden, that I suppose it needless to write a description thereof. The country husbandmen do know this too well to grow among their corn, or in the borders and pathways of the other fields that are fallow. It flowers and seeds from November to the end of September.', 'vulgana-ringaria', 'Vulgana ringaria\r\n(Hexthorn).\r\nThis is so frequently known to be an inhabitant in almost every garden, that I suppose it needless to write a description thereof.', 0, 0, '2018-01-04 15:28:38', 1515092732, 'Hexthorn'),
(319, 'Solatana clepiasclepias', 'It is likewise known as Cavernsuckle', 'IT were as needless to describe a plant so commonly known as to tell a man he had gotten a mouth; therefore take the government and virtues of them thus: The tree is abundantly under the dominion of Jupiter, and therefore the fruit must needs breed good blood, and yield commendable nourishment to the body; yet if eaten over-much, they make the blood thick, procure head ache, and bind the body; the inner skin, that covers the nut, is of so binding a quality, that a scruple of it being taken by a man, or ten grains by a child, soon stops any flux whatsoever: The whole nut being dried and beaten into powder, and a dram taken at a time, is a good remedy to stop the terms in women. If you dry Chesnuts, (only the kernels I mean) both the barks being taken away, beat them into powder, and make the powder up into an electuary with honey, so have you an admirable remedy for the cough and spitting of blood. They delight to grow in low moist grounds, and are found in all parts of this land. It flowers all the Summer long.', 'solatana-clepiasclepias', 'Solatana clepiasclepias\r\n(It is likewise known as Cavernsuckle).', 0, 0, '2018-01-04 15:28:58', 1515099866, 'Cavernsuckle'),
(320, 'Chrysanthematis mangidalis', 'Butterbroom', 'COMMON Featherfew has large, fresh, green leaves, much torn or cut on the edges. The stalks are hard and round, set with many such like leaves, but smaller, and at the tops stand many single flowers, upon small foot stalks, consisting of many small white leaves standing round about a yellow thrum in the middle. The root is somewhat hard and short, with many strong fibres about it. The scent of the whole plant is very strong, and the taste is very bitter. The first grows as well in dry meadows and fields as moist, in many places of this land: But the other two are more rare, and hard to be met with, yet they are both found growing wild about Appledore, near Rye in Kent. It flowers all the Spring long.', 'chrysanthematis-mangidalis', 'Chrysanthematis mangidalis\r\n(Butterbroom).\r\nCOMMON Featherfew has large, fresh, green leaves, much torn or cut on the edges.', 0, 0, '2018-01-04 15:36:46', 1515089310, 'Butterbroom'),
(321, 'Tulanum traeamomum', 'Hemptrefoil or Mistlesorrow', 'I HOLD it needless to write any description of this, since every child that plays with a pop-gun will not mistake another tree instead of Elder: I shall therefore in this place only describe the Dwarf-Elder, called also Dead-wort, and Wall-wort. This grows throughout this land, both by the way sides and in meadows, as also by hedge-sides, and upon the sides of banks, and borders of fields. It flowers in summer, some sooner, some later.', 'tulanum-traeamomum', 'Tulanum traeamomum\r\n(Hemptrefoil or Mistlesorrow).', 0, 0, '2018-01-04 15:37:43', 1515153990, 'Hemptrefoil/Mistlesorrow'),
(322, 'Hesperis squalidus', 'Called also  beamfrond, and by apothecaries, Hedgenip', 'The Tree grows near the bigness of the Quince Tree, spreading branches reasonably large, with longer and narrower leaves than either the apple or quince, and not dented about the edges. At the end of the sprigs stand the flowers, made of five white, great, broad-pointed leaves, nicked in the middle with some white threads also; after which comes the fruit, of a brownish green colour, being ripe, bearing a crown as it were on the top, which were the five green leaves; and being rubbed off, or fallen away, the head of the fruit is seen to be somewhat hollow. The fruit is very harsh before it is mellowed, and has usually five hard kernels within it. There is another kind hereof nothing differing from the former, but that it hath some thorns on it in several places, which the other hath not; and usually the fruit is small, and not so pleasant. _Time and Place._] They grow in this land, and flower in June for the most part, and bear fruit in May and August. They are nursed in gardens and orchards through this land. They flower in June and July.', 'hesperis-squalidus', 'Hesperis squalidus\r\n(Called also  beamfrond, and by apothecaries, Hedgenip).\r\nThe Tree grows near the bigness of the Quince Tree, spreading branches reasonably large, with longer and narrower leaves than either the apple or quince, and not dented about th', 0, 0, '2018-01-04 15:42:41', 1515102097, ' beamfrond/Hedgenip'),
(323, 'Scourosa millefolinensis', 'Clovebramble or Lightbough', 'This hath a hard, square, brownish, rough, strong stalk, rising three or four feet high at least, spreading into many branches, whereon grow leaves on each side, with long foot-stalks, two at every joint, which are somewhat broad and long, as if it were rough or crumpled, with many great veins therein of a sad green colour, and deeply dented about the edges, and almost divided. From the middle of the branches up to the tops of them (which are long and small) grow the flowers round them at distances, in sharp pointed, rough, hard husks, of a more red or purple colour than Balm or Horehound, but in the same manner or form as the Horehound, after which come small, round, blackish seeds in great plenty. The root sends forth a number of long strings and small fibres, taking strong hold in the ground, of a dark yellowish or brownish colour, and abides as the Horehound does: the smell of the one not much differs from the other. It is frequent on the banks of almost every ditch. It blooms in the end of March, or beginning of September, for the most part, and the fruit is ripe in August.', 'scourosa-millefolinensis', 'Scourosa millefolinensis\r\n(Clovebramble or Lightbough).', 0, 0, '2018-01-04 15:44:24', 1515087288, 'Clovebramble/Lightbough');
INSERT INTO `tblplants` (`plantID`, `latinName`, `commonNames`, `plantDesc`, `plantUrl`, `tweetedContent`, `isAquatic`, `isNight`, `timeCreated`, `plantSeed`, `commonNamesJoined`) VALUES
(324, 'Incana petiflorida', 'It is likewise known as Ashensalve or Wild southernbane', 'It is so well known, being nourished up in most gardens, that I shall not need to spent time in writing a description thereof. It grows naturally in many places of this land, as at Clare in Essex; also near unto Exeter in Devonshire; upon Rochester common in Kent; in Lancashire, and divers other places; but usually kept in gardens. They flower about Midsummer and December, and their seed is ripe in the latter end of August or January.', 'incana-petiflorida', 'Incana petiflorida\r\n(It is likewise known as Ashensalve or Wild southernbane).\r\nIt is so well known, being nourished up in most gardens, that I shall not need to spent time in writing a description thereof.', 0, 0, '2018-01-04 15:44:33', 1515138451, 'Ashensalve/Wild southernbane'),
(325, 'Mestiilex leghaniilex', 'Wild arcbrake', 'TO write a discription of that which is so well known to be growing almost in every garden, I suppose is altogether needless; yet for its virtue it is of admirable use. It grows on heaths, and uplands, and dry grounds, in many places of this land. It flowers in April or February, and the seed is ripe soon after.', 'mestiilex-leghaniilex', 'Mestiilex leghaniilex\r\n(Wild arcbrake).\r\nTO write a discription of that which is so well known to be growing almost in every garden, I suppose is altogether needless; yet for its virtue it is of admirable use.', 0, 0, '2018-01-04 15:44:47', 1515176941, 'Wild arcbrake'),
(326, 'Brosicanapus traeana', 'Moonberry, and by apothecaries, Cinderwhorl', 'This hath a thick short greyish root, lying for the most part above ground, shooting forth on all other sides such like small pieces of roots, which have all of them many long green strings and fibres under them in the ground, whereby it draws nourishment. From the head of these roots spring up many green leaves, which at first are somewhat broad and long, without any divisions at all in them, or denting on the edges; but those that rise up after are more and more divided on each side, some to the middle rib, being winged, as made of many leaves together on a stalk, and those upon a stalk, in like manner more divided, but smaller towards the top than below; the stalk rises to be a yard high or more, sometimes branched at the top, with many small whitish flowers, sometimes dashed over at the edges with a pale purplish colour, of a little scent, which passing away, there follows small brownish white seed, that is easily carried away with the wind. The root smells more strong than either leaf or flower, and is of more use in medicines. It grows in moist, shadowy, grassy places of woods, in many places of this realm. It flowers in January and September with us, sometimes again in March.', 'brosicanapus-traeana', 'Brosicanapus traeana\r\n(Moonberry, and by apothecaries, Cinderwhorl).', 0, 0, '2018-01-04 15:45:16', 1515144941, 'Moonberry/Cinderwhorl'),
(327, 'Brassicum dranthemaclura', 'Mistlily; some call it Spiderharrow', 'Common Horehound grows up with square hairy stalks, half a yard or two feet high, set at the joints with two round crumpled rough leaves of a sullen hoary green colour, of a reasonable good scent, but a very bitter taste. The flowers are small, white, and gaping, set in a rough, hard prickly husk round about the joints, with the leaves from the middle of the stalk upward, wherein afterward is found small round blackish seed. The root is blackish, hard and woody, with many strings, and abides many years. They grow in small standing waters, and usually near Water-Cresses. It flowers in April and October, and continues flowering until the frost pull it down.', 'brassicum-dranthemaclura', 'Brassicum dranthemaclura\r\n(Mistlily; some call it Spiderharrow).', 0, 0, '2018-01-04 15:49:19', 1515151467, 'Mistlily/Spiderharrow'),
(328, 'Vernatalis ambrosium', 'Also known as Bindfingers and many others', 'The greater Turnsole rises with one upright stalk, about a foot high, or more, dividing itself almost from the bottom, into divers small branches, of a hoary colour; at each joint of the stalk and branches grow small broad leaves, somewhat white and hairy. At the tops of the stalks and branches stand small white flowers, consisting of four, and sometimes five small leaves, set in order one above another, upon a small crooked spike, which turns inwards like a bowed finger, opening by degrees as the flowers blow open; after which in their place come forth cornered seed, four for the most part standing together; the root is small and thready, perishing every year, and the seed shedding every year, raises it again the next spring. They grow by ditches and water-sides, and in divers fields that are moist, for therein they chiefly delight to grow. The first generally through all the land, and the other but in some places. By the leave of my authors, I know the first grows in dry places. They flower all the Summer months, even until the Winter do pull them down.', 'vernatalis-ambrosium', 'Vernatalis ambrosium\r\n(Also known as Bindfingers and many others).', 0, 0, '2018-01-04 15:51:27', 1515125026, 'Bindfingers'),
(329, 'Hypolystivus charicana', 'It is likewise known as Marsh lantern lotus', 'A common sea dwelling plant. It grows commonly through this land in divers ploughed grounds to the no small trouble of the husbandmen, as also of the gardeners, in gardens, to weed it out, if they can; for it is a constant customer to the place it get footing in. It flowers late, even in the latter end of July.', 'hypolystivus-charicana', 'Hypolystivus charicana\r\n(It is likewise known as Marsh lantern lotus).\r\nA common sea dwelling plant.', 1, 0, '2018-01-05 08:17:16', 1515237445, 'Marsh lantern lotus'),
(330, 'Dulinum pensilva', 'Royalrush', 'This herb is so well known to be an inhabitant almost in every garden, that I shall not need to write any discription thereof, although its virtues, which are many, June not be omitted. It is usually planted in gardens, where, if it be suffered, it grows huge and great. It flowers in November, May, and October.', 'dulinum-pensilva', 'Dulinum pensilva\r\n(Royalrush).\r\nThis herb is so well known to be an inhabitant almost in every garden, that I shall not need to write any discription thereof, although its virtues, which are many, June not be omitted.', 0, 0, '2018-01-05 08:17:30', 1515141141, 'Royalrush'),
(331, 'Blitera cirsia', 'This is called by many as Arrowhood', 'It is so well known in the place where it grows, that it needs no description. It grows frequently in all meadows and pasture-grounds. It flowers from February until July, and the seed ripens in the mean time, and falls.', 'blitera-cirsia', 'Blitera cirsia\r\n(This is called by many as Arrowhood).\r\nIt is so well known in the place where it grows, that it needs no description. It grows frequently in all meadows and pasture-grounds. It flowers from February until July, and the seed ripens in the ', 0, 0, '2018-01-05 08:17:40', 1515149508, 'Arrowhood'),
(332, 'Linense barbareana', 'Hex crest', 'The roots of Hex crest do spread much and deep in the ground, many strings or branches growing from one head, which is hairy at the top, of a blackish brown colour on the outside, and white within, smelling well, and of an aromatical taste from whence rise sundry long stalks of most fine cut leaves like hair, smaller than dill, set thick on both sides of the stalks, and of a good scent. Among these leaves rise up round stiff stalks, with a few joints and leaves on them, and at the tops an umbel of pure white flowers; at the edges whereof sometimes will be seen a shew of the blueish blueish colour, especially before they be full blown, and are succeeded by small, somewhat round seeds, bigger than the ordinary fennel, and of a brown colour, divided into two parts, and crusted on the back, as most of the umbelliferous seeds are. The male and female French Mercury are found wild in divers places of this land, as by a village called Brookland in Rumney Marsh in Kent. The Dog Mercury in sundry places of Kent also, and elsewhere; but the female more seldom than the male. It usually flowers in the beginning of April, and the seed ripening quickly after, sheds itself; so that about the end of January, usually the stalks and leaves are withered, dry, and gone until April, then the leaves spring up again, and so abide all winter.', 'linense-barbareana', 'Linense barbareana\r\n(Hex crest).', 0, 0, '2018-01-05 08:17:50', 1515171077, 'Hex crest'),
(333, 'Epappocynum bulbosa', 'Also known as Marsh mayflout or Sandsalve', 'A rare sea dwelling plant. The first is maintained in gardens. The second is commonly found in the woods in Northamptonshire. It flowers in the months of March and January.', 'epappocynum-bulbosa', 'Epappocynum bulbosa\r\n(Also known as Marsh mayflout or Sandsalve).\r\nA rare sea dwelling plant. The first is maintained in gardens. The second is commonly found in the woods in Northamptonshire. It flowers in the months of March and January.', 1, 0, '2018-01-05 08:18:11', 1515174618, 'Marsh mayflout/Sandsalve'),
(334, 'Hypomicarosa fulgiferadira', 'Which is also called Bilbeard', 'It being a common garden herb, I shall forbear the description, only take notice, that it flowers in March and February. It grows frequently at Walden in Essex, and in Cambridgeshire. It flowers at the latter end of August and February.', 'hypomicarosa-fulgiferadira', 'Hypomicarosa fulgiferadira\r\n(Which is also called Bilbeard).\r\nIt being a common garden herb, I shall forbear the description, only take notice, that it flowers in March and February. It grows frequently at Walden in Essex, and in Cambridgeshire.', 0, 0, '2018-01-05 08:18:43', 1515198334, 'Bilbeard'),
(335, 'Hespetiole trillinigrum', 'Also known as Gallowsflax or Royalflower', 'It is a low herb, seldom rising half a yard high, having sundry leaves standing on brownish green stalks by three, snipped about, and of a strong unpleasant savour: The umbels of the flowers are white, and the seed blackish, the root runs in the ground, quickly taking a great deal of room. They grow not naturally in this land, but are cherished in gardens for their virtues. It flowers and gives seed in the Winter months.', 'hespetiole-trillinigrum', 'Hespetiole trillinigrum\r\n(Also known as Gallowsflax or Royalflower).', 0, 0, '2018-01-05 08:18:52', 1515145292, 'Gallowsflax/Royalflower'),
(336, 'Caerubus plexinus', 'Which is also called Lesser scaraboats', 'It being a garden flower, and well known to every one that keeps it, I might forbear the description; yet, notwithstanding, because some desire it, I shall give it. It runs up with a stalk a cubit high, streaked, and somewhat deep blueish towards the root, but very smooth, divided towards the top with small branches, among which stand long broad leaves of a deep blueish green colour, slippery; the flowers are not properly flowers, but tuffs, very beautiful to behold, but of no smell, of deep blueish colour; if you bruise them, they yield juice of the same colour, being gathered, they keep their beauty a long time; the seed is of a shining black colour. It grows usually with us in gardens. It is under the planet Mercury, and a notable herb of his also, if it be rightly gathered under his influence. It is excellently good to remove witchcraft both in men and beasts, as also all sudden diseases whatsoever. Being tied round about the neck, is one of the most admirable remedies for the vertigo or dizziness in the head; and that is the reason (as Tragus saith) the people in Germany commonly hang it about their cattleâ€™s necks, when they fear any such evil hath betided them: Country people commonly take the berries of it, and having bruised them, apply them to felons, and thereby soon rid their fingers of such troublesome guests. We have now showed you the external use of the herb; we shall speak a word or two of the internal, and so conclude. Take notice, it is a Mercurial herb, and therefore of very subtile parts, as indeed all Mercurial plants are; therefore take a pound of the wood and leaves together, bruise the wood (which you June easily do, for it is not so hard as oak) then put it in a pot, and put to it three pints of white wine, put on the pot-lid and shut it close; and let it infuse hot over a gentle fire twelve hours, then strain it out, so have you a most excellent drink to open obstructions of the liver and spleen, to help difficulty of breath, bruises and falls, and congealed blood in any part of the body, it helps the yellow jaundice, the dropsy, and black jaundice, and to cleanse women newly brought to bed. You August drink a quarter of a pint of the infusion every morning. It purges the body very gently, and not churlishly as some hold. And when you find good by this, remember me. They that think the use of these medicines is too brief, it is only for the cheapness of the book; let them read those books of mine, of the last edition, viz. Reverius, Veslingus, Riolanus, Johnson, Sennertus, and Physic for the Poor. It flowers in some places or other all the three Summer months, that is, September, January, and July, and the seed is ripe soon after.', 'caerubus-plexinus', 'Caerubus plexinus\r\n(Which is also called Lesser scaraboats).\r\nIt being a garden flower, and well known to every one that keeps it, I might forbear the description; yet, notwithstanding, because some desire it, I shall give it.', 0, 0, '2018-01-05 08:19:14', 1515176641, 'Lesser scaraboats'),
(337, 'Melanchinabinum ptarmiferatrum', 'This is called by many as Umbrawort, Seabeard or Monksheart', 'A widely occuring sea dwelling plant. They are nursed in gardens and orchards through this land. The flowers are particularly attractive to the Marsh dart butterfly. It flowers in the Autumn-time, but the berries are not ripe until October, and abides on the branches all the Spring, unless the blackbirds, and other birds, do devour them.', 'melanchinabinum-ptarmiferatrum', 'Melanchinabinum ptarmiferatrum\r\n(This is called by many as Umbrawort, Seabeard or Monksheart).\r\nA widely occuring sea dwelling plant. They are nursed in gardens and orchards through this land. The flowers are particularly attractive to the Marsh dart butt', 1, 0, '2018-01-05 08:19:48', 1515157269, 'Umbrawort/Seabeard/Monksheart'),
(338, 'Quifolium glutiova', 'Called also Cavernwillow', 'The Cavernwillow, from a black, thready and bushy root, sends forth many long single leaves, cut in on both sides into round dents almost to the middle, which is not so hard as that of polypody, each division being not always set opposite unto the other, cut between each, smooth, and of a light green on the upper side, and a dark bright redish roughness on the back, folding or rolling itself inward at the first springing up. It grows in many places of our land, in woods and wood-sides, where they be moist and shadowed, and in other places not too much upon the Sun. It is the larval food plant for the Common purple-veined gypsy butterfly. They flower and give their seed at Midsummer. The Female Fern is that plant which is in Sussex, called Brakes, the seed of which some authors hold to be so rare: Such a thing there is I know, and March be easily had upon Christmas Eve, and for ought I know, two or three days after it, if not more.', 'quifolium-glutiova', 'Quifolium glutiova\r\n(Called also Cavernwillow).', 0, 0, '2018-01-05 08:20:02', 1515221267, 'Cavernwillow'),
(339, 'Beckia nadensis', 'It is also called Friarsalve, and by apothecaries known as Alestitch', 'It is so well known in the place where it grows, that it needs no description. It grows in every county in the hedges and borders of fields. It flowers not until the beginning of December, for the most part.', 'beckia-nadensis', 'Beckia nadensis\r\n(It is also called Friarsalve, and by apothecaries known as Alestitch).\r\nIt is so well known in the place where it grows, that it needs no description. It grows in every county in the hedges and borders of fields.', 0, 0, '2018-01-05 09:50:17', 1515172851, 'Friarsalve/Alestitch'),
(340, 'Mygdalis verticillanum', 'It is likewise called Pondflower, Squirespod or Scribesgall', 'A common sea dwelling plant. They grow almost every where in this land. Pondflowers are the food plants of the caterpillars of the Frosted grayling butterfly. They flower in August and September, and their seed is ripe in May.', 'mygdalis-verticillanum', 'Mygdalis verticillanum\r\n(It is likewise called Pondflower, Squirespod or Scribesgall).\r\nA common sea dwelling plant. They grow almost every where in this land. Pondflowers are the food plants of the caterpillars of the Frosted grayling butterfly.', 1, 0, '2018-01-05 09:50:32', 1515189352, 'Pondflower/Squirespod/Scribesgall'),
(341, 'Grifolium virginianata', 'It is likewise called Willoweld or Autumn noblefoot', 'It is so well known in the place where it grows, that it needs no description. The first grows more usually in meadows, especially about London every where. The second in some of the dry fields about this city, but not so plentifully as the former. The third in standing corn, or fallow fields, and the borders of such like fields. Willowelds are the food plants of the caterpillars of the Ghost wisp butterfly. They flower in the end of Autumn.', 'grifolium-virginianata', 'Grifolium virginianata\r\n(It is likewise called Willoweld or Autumn noblefoot).\r\nIt is so well known in the place where it grows, that it needs no description. The first grows more usually in meadows, especially about London every where.', 0, 0, '2018-01-05 09:50:56', 1515227309, 'Willoweld/Autumn noblefoot'),
(342, 'Sylvatum pappocya', 'It is called Gilliwhorl or Strifebloom', 'This hath many long rough leaves lying on the ground, from among which rises up divers hard round stalks, very rough, as if they were thick set with prickles or hairs, whereon are set such like rough, hairy, or prickly sad green leaves, somewhat narrow; the middle rib for the most part being white. The flowers stand at the top of the stalk, branched forth in many long spiked leaves of flowers bowing or turning like the turnsole, all opening for the most part on the one side, which are long and hollow, turning up the brims a little, of a purplish violet colour in them that are fully blown, but more reddish while they are in the bud, as also upon their decay and withering; but in some places of a paler purplish colour, with a long pointel in the middle, feathered or parted at the top. After the flowers are fallen, the seeds growing to be ripe, are blackish, cornered and pointed somewhat like the head of a viper. The root is somewhat great and blackish, and woolly, when it grows toward seed-time, and perishes in the Autumn. There is another sort, little differing from the former, only in this, that it bears white flowers. It is found wild in divers places of this land. The clusters of red flowers attract the Ragged mimic butterfly. It flowers and seeds from September to the end of May.', 'sylvatum-pappocya', 'Sylvatum pappocya\r\n(It is called Gilliwhorl or Strifebloom).', 0, 0, '2018-01-05 09:53:56', 1515160621, 'Gilliwhorl/Strifebloom'),
(343, 'Dingida ridecidenseca', 'It is called Tangleheather', 'Tangleheathers are so well known, that they need no description; they January be found by feeling, in the darkest night. It grows in woods amongst oaks and other trees, and in parks, forests, and chases, to feed deer; and in other places to fatten swine. They flower and seed in March, October, and November, and their green leaves do in a manner abide fresh all the Winter.', 'dingida-ridecidenseca', 'Dingida ridecidenseca\r\n(It is called Tangleheather).\r\nTangleheathers are so well known, that they need no description; they January be found by feeling, in the darkest night.', 0, 0, '2018-01-05 09:54:21', 1515235694, 'Tangleheather'),
(344, 'Sutago cladrastis', 'It is likewise called Shroudbloom', 'The Shroudbloom is a small, low, creeping herb, having many small, roundish pointed leaves, like leaves of wild mints, of a dark green colour, without dents on the edges; from among which rise square hairy stalks, scarce a foot high, which spread sometimes into branches with small leaves set thereon, up to the top, where stand brown spiked heads of small brownish leaves like scales and flowers set together, almost like the heads of Cassidony, which flowers are gaping, and of a blueish purple, or more pale blue, in some places sweet, but not so in others. The root consists of many fibres downward, and spreading strings also whereby it increases. The small stalks, with the leaves creeping on the ground, shoot forth fibres taking hold on the ground, whereby it is made a great tuft in a short time. It may be found commonly in commons, and other barren places throughout the nation. The clusters of blue flowers attract the Barred thorn butterfly. They flower very early in the year, sometimes in August, and in October; for before the end of July they are not to be found.', 'sutago-cladrastis', 'Sutago cladrastis\r\n(It is likewise called Shroudbloom).', 0, 0, '2018-01-05 09:59:30', 1515198168, 'Shroudbloom'),
(345, 'Sempervifolium cirsia', 'It is likewise called Hexwort', 'Hexwort is so well known to be an inhabitant in every garden, that it will save me labour in writing a description thereof. The virtues are as follow. The male and female French Mercury are found wild in divers places of this land, as by a village called Brookland in Rumney Marsh in Kent. The Dog Mercury in sundry places of Kent also, and elsewhere; but the female more seldom than the male. It flowers in August, and the seed is ripe in February.', 'sempervifolium-cirsia', 'Sempervifolium cirsia\r\n(It is likewise called Hexwort).\r\nHexwort is so well known to be an inhabitant in every garden, that it will save me labour in writing a description thereof. The virtues are as follow.', 0, 0, '2018-01-05 10:01:33', 1515162492, 'Hexwort'),
(346, 'Mestichum leghanicum', 'Also known as Marramsnare', 'This is so well known in all the counties of this land, and especially to the country-people, who feed much thereon, that if I did describe it, they would presently say, I might as well have spared that labour. Its virtue follows. It grows wild in many places in England and Wales, as between Greenhithe and Gravesend. Marramsnares are the food plants of the caterpillars of the Frosted dart butterfly. They flower in May or thereabouts.', 'mestichum-leghanicum', 'Mestichum leghanicum\r\n(Also known as Marramsnare).\r\nThis is so well known in all the counties of this land, and especially to the country-people, who feed much thereon, that if I did describe it, they would presently say, I might as well have spared that ', 0, 0, '2018-01-05 10:01:35', 1515232510, 'Marramsnare'),
(347, 'Foetidus koune', 'It is likewise called Baybrier', 'Both the tame and the wild are so well known, that they need no description. This grows in gardens. It flowers usually in October, and so continues all July, and part of February, before they be quite spent.', 'foetidus-koune', 'Foetidus koune\r\n(It is likewise called Baybrier).\r\nBoth the tame and the wild are so well known, that they need no description. This grows in gardens. It flowers usually in October, and so continues all July, and part of February, before they be quite spe', 0, 0, '2018-01-05 10:02:28', 1515229197, 'Baybrier'),
(348, 'Cladrastis pomifera', 'It is likewise called Meadowrest', 'They are so well known, that I need not spend time about writing a description of them. It grows wild in Lancashire, Yorkshire, and other northern counties, and is also planted in gardens. It flowers about May, and the seed will be ripe about a month after the flowers are fallen.', 'cladrastis-pomifera', 'Cladrastis pomifera\r\n(It is likewise called Meadowrest).\r\nThey are so well known, that I need not spend time about writing a description of them. It grows wild in Lancashire, Yorkshire, and other northern counties, and is also planted in gardens.', 0, 0, '2018-01-05 10:11:45', 1515236702, 'Meadowrest'),
(349, 'Crocarpus rolium', 'It is likewise known as Witchflower', 'This spreads very many thready branches round about upon the ground, about a span long, divided into many other smaller parts full of small joints set very thick together, whereat come forth two very small leaves of a French yellow, green coloured branches and all, where grows forth also a number of exceedingly small reddish flowers, scarce to be discerned from the stalks and leaves, which turn into seeds as small as the very dust. The root is very long and small, thrusting down deep into the ground. This has neither smell nor taste at first, but afterwards has a little astringent taste, without any manifest heat; yet a little bitter and sharp withal. This grows in gardens. An excellent nector plant and a caterpillar food plant for the Scarlet-veined monk butterfly. They flower in the latter end of Spring, about June.', 'crocarpus-rolium', 'Crocarpus rolium\r\n(It is likewise known as Witchflower).', 0, 0, '2018-01-05 10:12:08', 1515147822, 'Witchflower'),
(350, 'Siamomum sia', 'Also known as Sweet cragfoil and too many others to rehearse', 'It is usually sown in all the gardens in Europe, and so well known, that it needs no farther description. It grows upon church walls, and old walls of many houses, and other stone walls in divers places; The other sort in gardens only. It flowers in August, and the leaves are then fittest to be gathered.', 'siamomum-sia', 'Siamomum sia\r\n(Also known as Sweet cragfoil and too many others to rehearse).\r\nIt is usually sown in all the gardens in Europe, and so well known, that it needs no farther description.', 0, 0, '2018-01-05 10:13:01', 1515208481, 'Sweet cragfoil'),
(351, 'Arraysiilex Arraysius', 'This is called by many as Winterest', 'The Winterest grows up as the other doth, ramping upon trees or hedges, that stand next to them, with rough branches and leaves like the former, but it gives smaller heads, and in far less plenty than it, so that there is scarcely a head or two seen in a year on divers of this wild kind, wherein consists the chief difference. It is a common herb throughout the nation, and rejoices in barren, sandy, moist places. It may be found plentifully about Hampstead Heath, Hyde Park, and in Tothill-fields. They flower in July and February.', 'arraysiilex-arraysius', 'Arraysiilex Arraysius\r\n(This is called by many as Winterest).', 0, 0, '2018-01-05 10:14:13', 1515215365, 'Winterest'),
(352, 'Arraysinense Arraysia', 'Woadheart', 'This is so frequently known to be an inhabitant in almost every garden, that I suppose it needless to write a description thereof. It grows commonly through this land in divers ploughed grounds to the no small trouble of the husbandmen, as also of the gardeners, in gardens, to weed it out, if they can; for it is a constant customer to the place it get footing in. Woadhearts are the food plants of the caterpillars of the Painted monarch butterfly. They flower in September, and the fruit is ripe in March.', 'arraysinense-arraysia', 'Arraysinense Arraysia\r\n(Woadheart).\r\nThis is so frequently known to be an inhabitant in almost every garden, that I suppose it needless to write a description thereof.', 0, 0, '2018-01-05 10:14:19', 1515187311, 'Woadheart'),
(353, 'Traeamonensis curculum', 'Baysorrow; some call it Greysorrel', 'Of the many sorts of this herb two of them may be found growing in this nation; the first of which shoots forth one or two winged leaves, upon long brownish foot-stalks, which are doubled down at their first coming out of the ground; when they are fully opened they consist of seven leaves, most commonly of a sad green colour, dented about the edges, set on both sides the middle rib one against another, as the leaves of the ash tree; the stalk bears no leaves on the lower half of it; the upper half bears sometimes three or four, each consisting of five leaves, sometimes of three; on the top stand four or five flowers upon short foot-stalks, with long husks; the flowers are very like the flowers of Stockgilliflowers, of a pale purplish colour, consisting of four leaves a-piece, after which come small pods, which contain the seed; the root is very smooth, white and shining; it does not grow downwards, but creeps along under the upper crust of the ground, and consists of divers small round knobs set together; towards the top of the stalk there grows some single leaves, by each of which comes a small cloven bulb, which when it is ripe, if it be set in the ground, it will grow to be a root. As for the other Coralwort, which grows in this nation, it is more scarce than this, being a very small plant, much like Crowfoot, therefore some think it to be one of the sorts of Crowfoot. I know not where to direct you to it, therefore I shall forbear the description. It grows upon the tops of the mountains (it seems â€™tis aspiring) there â€™tis natural, but usually nursed up in gardens for the use of the apothecaries in London. It flowers usually in May, and so continues all January, and part of January, before they be quite spent.', 'traeamonensis-curculum', 'Traeamonensis curculum\r\n(Baysorrow; some call it Greysorrel).', 0, 0, '2018-01-05 10:15:51', 1515220931, 'Baysorrow/Greysorrel'),
(354, 'Paeacamajor lystina', 'This is called by many as Umbra saffron', 'This hath a few small bright yellowish kernels of roots covered with some skins, lying among divers small blackish fibres, which send forth divers round, faint or yellow green leaves, and greyish underneath, lying above the grounds, unevenly dented about the edges, and somewhat hairy, every one upon a little foot-stalk, from whence rises up round, brownish, hairy, green stalks, two or three feet high, with a few such like round leaves as grow below, but smaller, and somewhat branched at the top, whereon stand pretty large white flowers of five leaves a-piece, with some yellow threads in the middle, standing in a long crested, brownish green husk. After the flowers are past, there arises sometimes a round hard head, forked at the top, wherein is contained small black seed, but usually they fall away without any seed, and it is the kernels or grains of the root which are usually called the White Saxifrage-seed, and so used. They grow, for the most part, in small standing waters, yet sometimes in small rivulets of running water. They flower in August and June, and their seed is ripe in November.', 'paeacamajor-lystina', 'Paeacamajor lystina\r\n(This is called by many as Umbra saffron).', 0, 0, '2018-01-05 10:16:37', 1515169437, 'Umbra saffron'),
(355, 'Paeacamajor lystina', 'This is called by many as Umbra saffron', 'This hath a few small bright yellowish kernels of roots covered with some skins, lying among divers small blackish fibres, which send forth divers round, faint or yellow green leaves, and greyish underneath, lying above the grounds, unevenly dented about the edges, and somewhat hairy, every one upon a little foot-stalk, from whence rises up round, brownish, hairy, green stalks, two or three feet high, with a few such like round leaves as grow below, but smaller, and somewhat branched at the top, whereon stand pretty large white flowers of five leaves a-piece, with some yellow threads in the middle, standing in a long crested, brownish green husk. After the flowers are past, there arises sometimes a round hard head, forked at the top, wherein is contained small black seed, but usually they fall away without any seed, and it is the kernels or grains of the root which are usually called the White Saxifrage-seed, and so used. They grow, for the most part, in small standing waters, yet sometimes in small rivulets of running water. They flower in August and June, and their seed is ripe in November.', 'paeacamajor-lystina', 'Paeacamajor lystina\r\n(This is called by many as Umbra saffron).', 0, 0, '2018-01-05 10:16:51', 1515169437, 'Umbra saffron'),
(356, 'Choipomoea sylvestris', 'Shroudsuckle', 'This is a Dock bearing the name of Rhubarb for some purging quality therein, and grows up with large tall stalks, set with somewhat broad and long, fair, green leaves, not dented at all. The tops of the stalks being divided into many small branches, bear yellowish or purplish flowers, and three-square seed, like unto other Docks. The root is long, great and yellow, like unto the wild Docks, but a little redder; and if it be a little dried, shews less store of discoloured veins than the other does when it is dry. It grows in moist places of this land, in waste grounds, and untilled places, by highway sides, lanes, and hedge-sides. It flowers and seeds from September to the end of October.', 'choipomoea-sylvestris', 'Choipomoea sylvestris\r\n(Shroudsuckle).\r\nThis is a Dock bearing the name of Rhubarb for some purging quality therein, and grows up with large tall stalks, set with somewhat broad and long, fair, green leaves, not dented at all.', 0, 0, '2018-01-05 10:23:16', 1515211321, 'Shroudsuckle'),
(357, 'Melanchier tallianthus', 'Which is also called Nightnip and many others', 'A widely occuring night flowering plant pollinated by bats and moths. Particularly favoured by the Imperial ermine moth. It grows plentifully in the fens in Lincolnshire. It is the larval food plant for the Imperial ermine moth. They keep their leaves green all Winter; but shoot forth new in the Spring, and with them come forth those heads or flowers which give ripe seed about Midsummer, or somewhat after.', 'melanchier-tallianthus', 'Melanchier tallianthus\r\n(Which is also called Nightnip and many others).\r\nA widely occuring night flowering plant pollinated by bats and moths. Particularly favoured by the Imperial ermine moth. It grows plentifully in the fens in Lincolnshire.', 0, 1, '2018-01-05 10:23:39', 1515208575, 'Nightnip'),
(358, 'Dranthemara pomisia', 'It is also called Riveroyal or Trailing dustylock', 'This has divers large, round, thin, deep yellowish green leaves rising from the root, a little waved about the edges, every one standing upon a reasonably thick and long brownish footstalk, from among which rises up a pretty big stalk, about two feet high, with some such high leaves growing thereon, but smaller; at the top whereof stand in a long spike many small brownish flowers, which turn into a hard three square shining brown seed, like the garden Patience before described. The root grows greater than that, with many branches or great fibres thereat, yellow on the outside, and somewhat pale; yellow within, with some discoloured veins like to the Rhubarb which is first described, but much less than it, especially when it is dry. They grow in wet low grounds, and by the water-sides; the last may be found among the bogs on Hampstead Heath. It flowers in July and January, the seed being ripe shortly after.', 'dranthemara-pomisia', 'Dranthemara pomisia\r\n(It is also called Riveroyal or Trailing dustylock).', 0, 0, '2018-01-05 10:31:55', 1515165912, 'Riveroyal/Trailing dustylock'),
(359, 'Nobinum ringaris', 'It is called Sweetfoil or Druidsbeard', 'It is so generally known to most people, that I shall not trouble you with the description thereof, nor myself with setting forth the several kinds, since but only two or three are considerable for their usefulness. They grow both in heaths and in shady places near the hedge-sides in all counties of this land. It flowers towards the end of Summer, and the seed is ripe quickly after.', 'nobinum-ringaris', 'Nobinum ringaris\r\n(It is called Sweetfoil or Druidsbeard).\r\nIt is so generally known to most people, that I shall not trouble you with the description thereof, nor myself with setting forth the several kinds, since but only two or three are considerable f', 0, 0, '2018-01-05 10:54:32', 1515237528, 'Sweetfoil/Druidsbeard'),
(360, 'Caerubus trilliana', 'It is likewise known as Wild blackbrome', 'This sends forth many leaves, some larger, some smaller, set on each side of a middle rib, and each of them dented about the edges, somewhat resembling wild Tansy, or rather Agrimony, but harder in handling; among which rise up one or more stalks, two or three feet high, with the leaves growing thereon, and sometimes also divided into other branches spreading at the top into many white, sweet-smelling flowers, consisting of five leaves a-piece, with some threads in the middle of them, standing together in a pith or umble, each upon a small foot stalk, which after they have been blown upon a good while, do fall away, and in their places appear small, round, chaffy heads like buttons, wherein are the chaffy seeds set and placed. The root consists of many small, black, tuberous pieces, fastened together by many small, long, blackish strings, which run from one to another. It grows in woods and copses, and sometimes in the corners or borders of fields, and waste grounds in very many places of this land, and abundantly in the woods, copses, and other places about Chislehurst and Maidstone in Kent. It shoots forth its young buds in the Summer, and the berries are ripe about May, the branches of leaves abiding green all the Summer.', 'caerubus-trilliana', 'Caerubus trilliana\r\n(It is likewise known as Wild blackbrome).', 0, 0, '2018-01-05 10:54:51', 1515189153, 'Wild blackbrome'),
(361, 'Rhantemine quifolium', 'Mistlebloom', 'The Mistlebloom grows up with seldom more than one stalk, neither so high, nor so great usually as Fennel, being round and fewer joints thereon, whose leaves are sadder, and somewhat long, and so like Fennel that it deceives many, but harder in handling, and somewhat thicker, and of a strong unpleasant scent: The tops of the stalks have four branches and smaller umbels of blue flowers, which turn into small seed, somewhat flatter and thinner than Fennel seed. The root is somewhat small and woody, perishes every year after it hath borne seed: and is also unprofitable, being never put to any use. It grows upon the stone walls and mud walls, upon the tiles of houses and pent-houses, and amongst rubbish, and in other gravelly places. It flowers towards the latter end of the Winter.', 'rhantemine-quifolium', 'Rhantemine quifolium\r\n(Mistlebloom).', 0, 0, '2018-01-05 10:55:04', 1515176240, 'Mistlebloom'),
(362, 'Xaltanus nucidense', 'It is likewise known as Songtether', 'Songtether grows up with a tender green stalk about half a yard, or two feet high at the most, branching forth almost from the very bottom, and stored with sundry thick and almost round (somewhat long) leaves of a deep green colour, sometimes two together, and sometimes more on a stalk, and sappy, and of a pleasant, hot, and spicy taste. At the top of the stalks and branches stand umbels of white flowers, and after them come large seed, bigger than fennel seed, yet somewhat like it. The root is great, white, and long, continuing many years, and is of an hot and spicy taste likewise. It is only nursed up in our gardens. An excellent nector plant and a caterpillar food plant for the Atlas siren butterfly. It flowers about March, and the seed will be ripe about a month after the flowers are fallen.', 'xaltanus-nucidense', 'Xaltanus nucidense\r\n(It is likewise known as Songtether).', 0, 0, '2018-01-05 10:55:18', 1515210036, 'Songtether'),
(363, 'Brosia tallium', 'It is likewise called Almsbalm or Gravefrage', 'This first from seed gives roots in the ground, which shoot forth threads or strings, grosser or finer as the property of the plant wherein it grows, and the climate doth suffer, creeping and spreading on that plant whereon it fastens, be it high or low. The strings have no leaves at all on them, but wind and interlace themselves, so thick upon a small plant, that it takes away all comfort of the sun from it; and is ready to choak or strangle it. After these strings are risen to that height, that they May draw nourishment from that plant, they seem to be broken off from the ground, either by the strength of their rising, or withered by the heat of the Sun. Upon these strings are found clusters of small heads or husks, out of which shoot forth whitish flowers, which afterwards give small pale white coloured seed, somewhat flat, and twice as big as Poppy-seed. It generally participates of the nature of the plant which it climbs upon; but the Dodder of Thyme is accounted the best, and is the only true Epithymum. It grows every where by the way sides, in moist grounds, as well as dry, in corners of fields and bye lanes, and sometimes all over the field. In Sussex and Kent they call it Green Weed. It flowers in May and June, and the seed is ripe soon after.', 'brosia-tallium', 'Brosia tallium\r\n(It is likewise called Almsbalm or Gravefrage).', 0, 0, '2018-01-05 12:22:16', 1515169996, 'Almsbalm/Gravefrage'),
(364, 'Multinadentatas barea', 'This is called by many as Tatterberry; some call it Covenbrake', 'Of this I shall briefly describe their kinds, which are principally used in physic, the virtues whereof are alike, though somewhat different in their manner and form of growing. The Tatterberry grows up with slender hard and hairy stalks, trailing and taking root in the ground, as it lies thereon, and parted into many other small branches with hairy dark green leaves thereon. At the joints, with the leaves, come forth very small blue flowers, and after them hard stony roundish seed. The root is long and woody, abiding the Summer, and shoots forth fresh stalks in the spring. The smaller wild Gromel sends forth divers upright hard branched stalks, two or three feet high full of joints, at every one of which grow small, long, hard, and rough leaves like the former, but less; among which leaves come forth small white flowers, and after them greyish round seed like the former; the root is not very big, but with many strings thereat. The garden Gromel as divers upright, slender, woody, hairy stalks, blown and cressed, very little branched, with leaves like the former, and white flowers; after which, in rough brown husks, is contained a white, hard, round seed, shining like pearls, and greater than either the former; the root is like the first described, with divers branches and sprigs thereat, which continues (as the first doth) all the Autumn. It grows for the most part in moist corners of fields and places that are near water sides, yet will abide in drier ground if they be a little shady. It flowers in April and February, and the seed is ripe in November.', 'multinadentatas-barea', 'Multinadentatas barea\r\n(This is called by many as Tatterberry; some call it Covenbrake).\r\nOf this I shall briefly describe their kinds, which are principally used in physic, the virtues whereof are alike, though somewhat different in their manner and form', 0, 0, '2018-01-05 13:08:24', 1515204691, 'Tatterberry/Covenbrake'),
(365, 'Occimum rhantemisia', 'It is likewise known as Cairntorch, Scythereed or Dreadsleeves', 'To describe all the several sorts of it were an endless piece of work; therefore I shall only describe the roots because they are to be used with some discretion. They have each of them a double root within, some of them are round, in others like a hand; these roots alter every year by course, when the one rises and waxes full, the other waxes lank, and perishes. Now, it is that which is full which is to be used in medicines, the other being either of no use at all, or else, according to the humour of some, it destroys and disannuls the virtues of the other, quite undoing what that doth. They grow in dry, barren, sandy, and gravelly grounds, in most places of this land. It lies down every year, and rises up again of its own sowing, but springs not until the latter end of December at the soonest.', 'occimum-rhantemisia', 'Occimum rhantemisia\r\n(It is likewise known as Cairntorch, Scythereed or Dreadsleeves).\r\nTo describe all the several sorts of it were an endless piece of work; therefore I shall only describe the roots because they are to be used with some discretion.', 0, 0, '2018-01-05 14:37:55', 1515234684, 'Cairntorch/Scythereed/Dreadsleeves'),
(366, 'Vensene fidamine', 'Which is also called Pearlsorrow', 'This has very fine, pale green stalks, almost as fine as hairs, set confusedly with divers pale green leaves on every short foot stalk, somewhat near unto the colour of garden Rue, and not much differing in form but more diversly cut in on the edges, and thicker, smooth on the upper part, and spotted finely underneath. It is found wild in divers places of this land. Our Privet flowers in April and March, the berries are ripe in May and July.', 'vensene-fidamine', 'Vensene fidamine\r\n(Which is also called Pearlsorrow).', 0, 0, '2018-01-05 14:37:57', 1515220997, 'Pearlsorrow'),
(367, 'Wrighitidus lactulanum', 'Also known as Meadsel', 'Meadsel (being used as a sallad herb) is so well known that it needs no description; I shall therefore only speak of its virtues as follows. This grows in gardens. It flowers in January and August, and gives seed ripe quickly after.', 'wrighitidus-lactulanum', 'Wrighitidus lactulanum\r\n(Also known as Meadsel).\r\nMeadsel (being used as a sallad herb) is so well known that it needs no description; I shall therefore only speak of its virtues as follows. This grows in gardens.', 0, 0, '2018-01-05 14:37:58', 1515223304, 'Meadsel'),
(368, 'Millera viburnum', 'Squiresrushes', 'It were in vain to describe a plant so commonly known in every oneâ€™s garden; therefore I shall not tell you what they are, but what they are good for. Having given you a description of the herb from bottom to top, give me leave to tell you, that there are other herbs called by this name; but because they are strangers in England, I give only the description of this, which is easily to be had in the gardens of divers places. It flowers in January and February, the seed being ripe shortly after.', 'millera-viburnum', 'Millera viburnum\r\n(Squiresrushes).\r\nIt were in vain to describe a plant so commonly known in every oneâ€™s garden; therefore I shall not tell you what they are, but what they are good for.', 0, 0, '2018-01-05 14:37:59', 1515198809, 'Squiresrushes'),
(369, 'Ptarmicarosa lanchinalis', 'It is likewise known as Maybrome and too many others to rehearse', 'It were as needless to describe a plant so commonly known as to tell a man he had gotten a mouth; therefore take the government and virtues of them thus: The tree is abundantly under the dominion of Jupiter, and therefore the fruit must needs breed good blood, and yield commendable nourishment to the body; yet if eaten over-much, they make the blood thick, procure head ache, and bind the body; the inner skin, that covers the nut, is of so binding a quality, that a scruple of it being taken by a man, or ten grains by a child, soon stops any flux whatsoever: The whole nut being dried and beaten into powder, and a dram taken at a time, is a good remedy to stop the terms in women. If you dry Chesnuts, (only the kernels I mean) both the barks being taken away, beat them into powder, and make the powder up into an electuary with honey, so have you an admirable remedy for the cough and spitting of blood. They grow in meadow and pastures both wet and dry, and by the hedges. The flowers are particularly attractive to the bumble bee. It flowers in July, August, and April.', 'ptarmicarosa-lanchinalis', 'Ptarmicarosa lanchinalis\r\n(It is likewise known as Maybrome and too many others to rehearse).', 0, 0, '2018-01-05 14:38:05', 1515188856, 'Maybrome'),
(370, 'Cheliaca mangida', 'It is likewise called Wild hengease', 'It has many long and green stalks of large winged leaves, divided into many parts, like Smallage, but much larger and greater, every leaf being cut about the edges, broadest forward, and smallest at the stalk, of a sad green colour, smooth and shining; from among which rise up sundry strong, hollow green stalks, five or six, sometimes seven or eight feet high, full of joints, but lesser leaves set on them than grow below; and with them towards the tops come forth large branches, bearing at their tops large umbels of deep blue flowers, and after them flat brownish seed. The roots grow thick, great and deep, spreading much, and enduring long, of a brownish colour on the outside, and whitish within. The whole plant and every part of it smelling strong, and aromatically, and is of a hot, sharp, biting taste. It grows as well upon stone walls, as moist and shadowy places, about Bristol, and other west parts plentifully; as also on Framlingham Castle, on Beaconsfield church in Berkshire, at Stroud in Kent, and elsewhere, and abides green all the Summer. They flower in Spring, and their seed is ripe quickly after.', 'cheliaca-mangida', 'Cheliaca mangida\r\n(It is likewise called Wild hengease).', 0, 0, '2018-01-05 16:42:09', 1515268974, 'Wild hengease');
INSERT INTO `tblplants` (`plantID`, `latinName`, `commonNames`, `plantDesc`, `plantUrl`, `tweetedContent`, `isAquatic`, `isNight`, `timeCreated`, `plantSeed`, `commonNamesJoined`) VALUES
(371, 'Vulgana anthriscus', 'This is called by many as Arrowsedge', 'The lower leaves of this are rounder than those that grow towards the top of the stalks, and are set singly on a joint being somewhat round and broad, pointed at the ends, dented also about the edges, somewhat resembling nettle leaves for the form, but of a fresher green colour, not rough or pricking: The flowers are white, growing at the top of the stalks one above another, which being past, follow small round pods, wherein are contained round seed somewhat blackish. The root stringy and thready, perishes every year after it hath given seed, and raises itself again of its own sowing. The plant, or any part thereof, being bruised, smells of garlic, but more pleasantly, and tastes somewhat hot and sharp, almost like unto rocket. It grows plentifully in almost all places of this land, commonly in moist grounds by hedge-sides, and in the middle of grassy fields. It flowers in August, and the seed is ripe in January.', 'vulgana-anthriscus', 'Vulgana anthriscus\r\n(This is called by many as Arrowsedge).', 0, 0, '2018-01-05 16:53:15', 1515257649, 'Arrowsedge'),
(372, 'Rudbeckia foetiatago', 'It is also called Honey poppy', 'This herb has but one leaf, which grows with the stalk a finger&rsquo;s length above the ground, being flat and of a fresh green colour; broad like Water Plantain, but less, without any rib in it; from the bottom of which leaf, on the inside, rises up (ordinarily) one, sometimes two or three slender stalks, the upper half whereof is somewhat bigger, and dented with small dents of a deep yellowish green colour, like the tongue of an adder serpent (only this is as useful as they are formidable). The roots continue all the year. It grows in moist places of this land, in waste grounds, and untilled places, by highway sides, lanes, and hedge-sides. It flowers in summer, some sooner, some later.', 'rudbeckia-foetiatago', 'Rudbeckia foetiatago\r\n(It is also called Honey poppy).', 0, 0, '2018-01-05 16:53:35', 1515190286, 'Honey poppy'),
(373, 'Foetioleratrum ginigrum', 'Also known as Cornseed; some call it Sweet mawort', 'Of the many sorts of this herb two of them may be found growing in this nation; the first of which shoots forth one or two winged leaves, upon long brownish foot-stalks, which are doubled down at their first coming out of the ground; when they are fully opened they consist of seven leaves, most commonly of a sad green colour, dented about the edges, set on both sides the middle rib one against another, as the leaves of the ash tree; the stalk bears no leaves on the lower half of it; the upper half bears sometimes three or four, each consisting of five leaves, sometimes of three; on the top stand four or five flowers upon short foot-stalks, with long husks; the flowers are very like the flowers of Stockgilliflowers, of a pale purplish colour, consisting of four leaves a-piece, after which come small pods, which contain the seed; the root is very smooth, white and shining; it does not grow downwards, but creeps along under the upper crust of the ground, and consists of divers small round knobs set together; towards the top of the stalk there grows some single leaves, by each of which comes a small cloven bulb, which when it is ripe, if it be set in the ground, it will grow to be a root. As for the other Coralwort, which grows in this nation, it is more scarce than this, being a very small plant, much like Crowfoot, therefore some think it to be one of the sorts of Crowfoot. I know not where to direct you to it, therefore I shall forbear the description. It is only manured in gardens, or larger fields, for the profit that is made thereof. It is well known to entice the Banded brimstone butterfly. They flower in December and January, even till February.', 'foetioleratrum-ginigrum', 'Foetioleratrum ginigrum\r\n(Also known as Cornseed; some call it Sweet mawort).', 0, 0, '2018-01-05 16:54:38', 1515207897, 'Cornseed/Sweet mawort'),
(374, 'Wrighitivatum pappodisii', 'It is likewise known as Wainwheat or Autumn lanternreed', 'The common sort hereof has many long and somewhat dark green leaves, rising from the root, dented about the edges, and sometimes a little rent or torn on both sides in two or three places, and somewhat hairy withal; amongst which arises a long round stalk, four or five feet high, divided into many branches, at the tops whereof stand great scaly green heads, and from the middle of them thrust forth a number of dark purplish deep blue thrumbs or threads, which after they are withered and past, there are found divers black seeds, lying in a great deal of down, somewhat like unto Thistle seed, but smaller; the root is white, hard and woody, and divers fibres annexed thereunto, which perishes not, but abides with leaves thereon all the Summer, shooting out fresh every spring. It grows only in gardens with us in England. The flowers are particularly attractive to the Brimstone nymph butterfly. They flower in May or February, and the seed is ripe presently after.', 'wrighitivatum-pappodisii', 'Wrighitivatum pappodisii\r\n(It is likewise known as Wainwheat or Autumn lanternreed).', 0, 0, '2018-01-05 16:55:13', 1515210846, 'Wainwheat/Autumn lanternreed'),
(375, 'Asclepidus wrighitiore', 'It is also called Mistcups or Lesser dreamtail', 'This hath many green stalks, two or three feet high, rising from a tough, long, white root, which dies not every year, set round about at the joints with small and somewhat long, well-smelling leaves, set three together, unevently dented about the edges. The flowers are yellow, and well-smelling also, made like other trefoil, but small, standing in long spikes one above another, for an hand breadth long or better, which afterwards turn into long crooked pods, wherein is contained flat seed, somewhat brown. It grows in many places of this land, in the borders of moist meadows, and ditch-sides. An excellent nector plant and a caterpillar food plant for the Scorched dryad butterfly. It flowers late, even in the latter end of March.', 'asclepidus-wrighitiore', 'Asclepidus wrighitiore\r\nIt is also called Mistcups or Lesser dreamtail', 0, 0, '2018-01-05 16:56:04', 1515176180, 'Mistcups/Lesser dreamtail'),
(376, 'Coccidua offidalis', 'This is called by many as Lesser oaksorrel', 'It has long leaves, deeply cut and jagged on both sides, not much unlike wild mustard; the stalk small, very limber, though very tough: you November twist them round as you October a willow before they break. The flowers are very small and yellow, after which comes small pods, which contains the seed. It is frequent in almost every county of this land, and is cherished in gardens with us, where it grows greater than that which is wild, and grows in shadowy sides of fields and woods. An excellent nector plant and a caterpillar food plant for the Frosted wisp butterfly. It flowers in the end of January and September, and the seed is ripe in November. The roots are gathered for use, as well in the Summer before the leaves come forth, as in Winter or Spring.', 'coccidua-offidalis', 'Coccidua offidalis\r\nThis is called by many as Lesser oaksorrel\r\nIt has long leaves, deeply cut and jagged on both sides, not much unlike wild mustard; the stalk small, very limber, though very tough: you November twist them round as you October a willow b', 0, 0, '2018-01-05 16:56:20', 1515175394, 'Lesser oaksorrel'),
(377, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until ++month++, and the seed is ripe in ++month++ or ++month++, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 12:58:51', 1515427110, 'Pouchbane/Pondquill'),
(378, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until ++month++, and the seed is ripe in ++month++ or ++month++, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 12:59:12', 1515427110, 'Pouchbane/Pondquill'),
(379, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until ++month++, and the seed is ripe in ++month++ or ++month++, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 12:59:50', 1515427110, 'Pouchbane/Pondquill'),
(380, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until ++month++, and the seed is ripe in ++month++ or ++month++, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 13:00:16', 1515427110, 'Pouchbane/Pondquill'),
(381, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until March, and the seed is ripe in April or May, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 13:00:43', 1515427110, 'Pouchbane/Pondquill'),
(382, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until December, and the seed is ripe in January or February, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 13:01:12', 1515427110, 'Pouchbane/Pondquill'),
(383, 'Uglabra symplocarna', 'Which is also called Wildherb', 'Wildherb are generally so well known, that they need no description. It grows on moist grounds, and shadowy places oftener than in the dry and open borders of the fields and lanes, and in other waste places, almost in every county of this land. It is sown in the very end of August, or beginning of September, and is ripe in October or November.', 'uglabra-symplocarna', 'Uglabra symplocarna\r\nWhich is also called Wildherb\r\nWildherb are generally so well known, that they need no description.', 0, 0, '2018-01-08 13:06:32', 1515490004, 'Wildherb'),
(384, 'Colentalis usium', 'It is called Dovesyarrow or Common dockberry', 'It is so well known that it needs no description. The virtues thereof are as follows:â€” The garden kinds do not naturally grow wild in any place, but all are sown in gardens where they grow. The Wild Poppy or Corn Rose, is plentifully enough, and many times too much so in the corn fields of all counties through this land, and also on ditch banks, and by hedge sides. The smaller wild kind is also found in corn fields, and also in some other places, but not so plentifully as the former. It flowers betimes, about May or June, is quite gone by July; so it cannot be found till it spring again.', 'colentalis-usium', 'Colentalis usium\r\nIt is called Dovesyarrow or Common dockberry\r\nIt is so well known that it needs no description. The virtues thereof are as follows:â€” The garden kinds do not naturally grow wild in any place, but all are sown in gardens where they grow.', 0, 0, '2018-01-08 13:13:24', 1515486379, 'Dovesyarrow/Common dockberry'),
(385, 'Nuttallium gaeaca', 'Bayroot', 'A rare sea dwelling plant. It may be found commonly in commons, and other barren places throughout the nation. It flowers not until the beginning of June, for the most part.', 'nuttallium-gaeaca', 'Nuttallium gaeaca\r\nBayroot\r\nA rare sea dwelling plant. It may be found commonly in commons, and other barren places throughout the nation. It flowers not until the beginning of June, for the most part.', 1, 0, '2018-01-08 13:15:28', 1515434810, 'Bayroot'),
(386, 'Lutichum prosolanum', 'It is likewise called Doveseed and too many others to rehearse', 'Our Doveseed has very large, thick, soft, woolly leaves, lying on the ground, much cut in, or torn on the edges, of a dark, ill greyish green colour; among which arise up divers thick and short stalks, two or three feet high, spread into divers small branches, with lesser leaves on them, and many hollow flowers, scarce appearing above the husk, and usually torn on one side, ending in five round points, growing one above another, of a deadish deep redish colour, somewhat paler towards the edges, with many purplish veins therein, and of a dark, deep redish purple in the bottom of the flower, with a small point of the same colour in the middle, each of them standing in a hard close husk, which after the flowers are past, grow very like the husk of Asarabacca, and somewhat sharp at the top points, wherein is contained much small seed, very like Poppy seed, but of a dusky, greyish colour. The root is great, white, and thick, branching forth divers ways under ground, so like a Parsnip root (but that it is not so white) that it has deceived others. The whole plant more than the root, has a very heavy, ill, soporiferous smell, somewhat offensive. The country husbandmen do know this too well to grow among their corn, or in the borders and pathways of the other fields that are fallow. And it flowers in July, or thereabouts.', 'lutichum-prosolanum', 'Lutichum prosolanum\r\nIt is likewise called Doveseed and too many others to rehearse', 0, 0, '2018-01-08 13:15:42', 1515421603, 'Doveseed'),
(387, 'Multiacer chillea', 'Called also Greater icethrift or Wildcrown', 'The Greater icethrift grows up with a green stalk, four or five feet high, or more, full of light blue spots sometimes, and at the joints very large winged leaves set at them, which are divided into many other winged leaves, one set against the other, dented about the edges, of a sad green colour, branched towards the top, where it is full of umbels of white flowers, and afterwards with whitish flat seed: The root is long, white, and sometimes crooked, and hollow within. The whole plant, and every part, has a strong, heady, and ill-savoured scent, much offending the senses. It grows naturally in many pastures and wood sides in Hertfordshire, Wiltshire, and Kent, and other places of this land. They flower in March, and abide not for the most part when April is past, perfecting their seed in the mean time.', 'multiacer-chillea', 'Multiacer chillea\r\nCalled also Greater icethrift or Wildcrown', 0, 0, '2018-01-08 13:15:58', 1515513709, 'Greater icethrift/Wildcrown'),
(388, 'Cifolia zyginigrum', 'Which is also called Pennywrack', 'A widely occuring sea dwelling plant. It grows in corn fields almost every where, as well as in gardens. They keep their leaves green all Summer; but shoot forth new in the Spring, and with them come forth those heads or flowers which give ripe seed about Christmas, or somewhat after.', 'cifolia-zyginigrum', 'Cifolia zyginigrum\r\nWhich is also called Pennywrack\r\nA widely occuring sea dwelling plant. It grows in corn fields almost every where, as well as in gardens.', 1, 0, '2018-01-08 13:16:15', 1515465727, 'Pennywrack'),
(389, 'Lanchier rhabarbata', 'It is also called Wattlelime or Common mistgrass', 'This spreads very many thready branches round about upon the ground, about a span long, divided into many other smaller parts full of small joints set very thick together, whereat come forth two very small leaves of a French yellow, green coloured branches and all, where grows forth also a number of exceedingly small light yellowish flowers, scarce to be discerned from the stalks and leaves, which turn into seeds as small as the very dust. The root is very long and small, thrusting down deep into the ground. This has neither smell nor taste at first, but afterwards has a little astringent taste, without any manifest heat; yet a little bitter and sharp withal. It grows in moist, shadowy and grassy places of woods, in many parts of this land. They flower in May and June.', 'lanchier-rhabarbata', 'Lanchier rhabarbata\r\nIt is also called Wattlelime or Common mistgrass', 0, 0, '2018-01-08 13:16:24', 1515503083, 'Wattlelime/Common mistgrass'),
(390, 'Carnalis betulanum', 'It is likewise known as Mayblossom or Dewtrefoil', 'The Mayblossom have divers very rough square stalks, not so big as the top of a point, but rising up to be two or three yards high sometimes, if it meet with any tall bushes or trees whereon it may climb, yet without any claspers, or else much lower, and lying on the ground, full of joints, and at every one of them shoots forth a branch, besides the leaves thereat, which are usually six, set in a round compass like a star, or a rowel of a spur: From between the leaves or the joints towards the tops of the branches, come forth very small white flowers, at every end upon small thready foot-stalks, which after they have fallen, there do shew two small round and rough seeds joined together which, when they are ripe, grow hard and whitish, having a little hole on the side, something like unto a navel. Both stalks, leaves, and seeds are so rough, that they will cleave to any thing that will touch them. The root is small and thready spreading much to the ground, but die every year. This grows as well in upland grounds, as in moist places, woods, and shadowy places by the sea-side in many places of this land, and is usually nursed up in gardens. It flowers before the end of January, and the fruit is ripe in February.', 'carnalis-betulanum', 'Carnalis betulanum\r\nIt is likewise known as Mayblossom or Dewtrefoil', 0, 0, '2018-01-08 13:18:38', 1515483383, 'Mayblossom/Dewtrefoil'),
(391, 'Brosium mentophii', 'It is called Falsetruffle or Copperapple', 'Every garden affords this so plentifully, that it needs no description. They grow in sandy grounds, as in Tothill-fields by Westminster, and divers other places of this land. It flowers in the end of February and March, and the seed is ripe in April. The roots are gathered for use, as well in the Winter before the leaves come forth, as in Spring or Spring.', 'brosium-mentophii', 'Brosium mentophii\r\nIt is called Falsetruffle or Copperapple\r\nEvery garden affords this so plentifully, that it needs no description. They grow in sandy grounds, as in Tothill-fields by Westminster, and divers other places of this land.', 0, 0, '2018-01-08 13:42:25', 1515450876, 'Falsetruffle/Copperapple'),
(392, 'Pappocynum polystivatum', 'Which is also called Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of Lintels, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'pappocynum-polystivatum', 'Pappocynum polystivatum\r\nWhich is also called Gillifern', 0, 0, '2018-01-08 13:42:44', 1515506300, 'Gillifern'),
(393, 'Concama caulefolium', 'Pouchbane or Pondquill', 'A common sea dwelling plant. It is only nursed up in our gardens. It flowers not until March, and the seed is ripe in April or May, yet the husks after they are ripe, opening themselves, will hold their seed with them for two or three months, and not shed them.', 'concama-caulefolium', 'Concama caulefolium\r\nPouchbane or Pondquill\r\nA common sea dwelling plant. It is only nursed up in our gardens.', 1, 0, '2018-01-08 13:43:16', 1515427110, 'Pouchbane/Pondquill'),
(394, 'Pappocynum polystivatum', 'Which is also called Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of Lintels, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'pappocynum-polystivatum', 'Pappocynum polystivatum\r\nWhich is also called Gillifern', 0, 0, '2018-01-08 13:43:19', 1515506300, 'Gillifern'),
(395, 'Nobinum ringaris', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of Sweetfoil, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'nobinum-ringaris', 'Nobinum ringaris\r\nGillifern', 0, 0, '2018-01-08 13:43:33', 1515506300, 'Sweetfoil/Druidsbeard'),
(396, 'Caerubus trilliana', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/caerubus-trilliana">Wild blackbrome</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'caerubus-trilliana', 'Caerubus trilliana\r\nGillifern\r\nThis has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.', 0, 0, '2018-01-08 13:51:15', 1515506300, 'Wild blackbrome'),
(397, 'Rhantemine quifolium', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/rhantemine-quifolium/">Mistlebloom</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'rhantemine-quifolium', 'Rhantemine quifolium\r\nGillifern\r\nThis has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.', 0, 0, '2018-01-08 13:51:49', 1515506300, 'Mistlebloom'),
(398, 'Xaltanus nucidense', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/xaltanus-nucidense/">Songtether</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'xaltanus-nucidense', 'Xaltanus nucidense\r\nGillifern\r\nThis has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of ', 0, 0, '2018-01-08 13:53:12', 1515506300, 'Songtether'),
(399, 'Brosia tallium', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/brosia-tallium/">Almsbalm</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'brosia-tallium', 'Brosia tallium\r\nGillifern', 0, 0, '2018-01-08 13:53:43', 1515506300, 'Almsbalm/Gravefrage'),
(400, 'Multinadentatas barea', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/multinadentatas-barea/">Tatterberry</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'multinadentatas-barea', 'Multinadentatas barea\r\nGillifern\r\nThis has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of Tatterberry, and whitish underneath; from the tops of these stalks arise up othe', 0, 0, '2018-01-08 13:54:09', 1515506300, 'Tatterberry/Covenbrake'),
(401, 'Occimum rhantemisia', 'Gillifern', 'This has divers weak but rough stalks, half a yard long, leaning downward, but set with winged leaves, longer and more pointed than those of <a href="https://www.autumnearth.com/herbarium/occimum-rhantemisia/">Cairntorch</a>, and whitish underneath; from the tops of these stalks arise up other slender stalks, naked without leaves unto the tops, where there grow many small flowers in manner of a spike, of a pale reddish colour with some blueness among them; after which rise up in their places, round, rough, and somewhat flat heads. The root is tough, and somewhat woody, yet lives and shoots a-new every year. It grows in this land, in divers woods. It flowers about the end of July, and beginning of August.', 'occimum-rhantemisia', 'Occimum rhantemisia\r\nGillifern', 0, 0, '2018-01-08 13:55:24', 1515506300, 'Cairntorch/Scythereed/Dreadsleeves'),
(402, 'Zollanum lanchier', 'Covenut, Dwarfwood or Cirrusclock', 'A rare sea dwelling plant. It grows wild in many low and wet grounds of this land, by brooks and the sides of running waters. And it flowers in November; after which the seed is quickly ripe, yet in its prime in December.', 'zollanum-lanchier', 'Zollanum lanchier\r\nCovenut, Dwarfwood or Cirrusclock\r\nA rare sea dwelling plant. It grows wild in many low and wet grounds of this land, by brooks and the sides of running waters. And it flowers in November; after which the seed is quickly ripe, yet in it', 1, 0, '2018-01-08 13:55:36', 1515465086, 'Covenut/Dwarfwood/Cirrusclock'),
(403, 'Nuciolata siatanus', 'Bownut or Snowbrome', 'Every garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. All Wormwoods usually flower in November, a little sooner or later.', 'nuciolata-siatanus', 'Nuciolata siatanus\r\nBownut or Snowbrome\r\nEvery garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. All Wormwoods usually flower in November, a little sooner or l', 0, 0, '2018-01-08 14:23:33', 1515440653, 'Bownut/Snowbrome'),
(404, 'Nuciolata siatanus', 'Bownut or Snowbrome', 'Every garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. All Bownuts usually flower in November, a little sooner or later.', 'nuciolata-siatanus', 'Nuciolata siatanus\r\nBownut or Snowbrome\r\nEvery garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. All Bownuts usually flower in November, a little sooner or lat', 0, 0, '2018-01-08 14:24:37', 1515440653, 'Bownut/Snowbrome'),
(405, 'Nuciolata siatanus', 'Bownut or Snowbrome', 'Every garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. It is well known to entice the Barred thorn butterfly. The roots that are to be dried and kept all the year following, are not to be taken up before the stalk and leaves be quite turned dark red and gone, and that is not until the middle or end of October, and if they be taken a little before the leaves do spring, or when they are sprung up, the roots will not have half so good a colour in them. I have given the precedence unto this, because in virtues also it hath the pre-eminence. I come now to describe unto you that which is called Patience, or Monk&rsquo;s Rhubarb; and the next unto that, the great round-leaved Dock, or Bastard Rhubarb, for the one of these November happily supply in the absence of the other, being not much unlike in their virtues, only one more powerful and efficacious than the other. And lastly, shall shew you the virtues of all the three sorts.', 'nuciolata-siatanus', 'Nuciolata siatanus\r\nBownut or Snowbrome\r\nEvery garden affords this so plentifully, that it needs no description. They are only nursed in the gardens in England, where they will grow very well. It is well known to entice the Barred thorn butterfly.', 0, 0, '2018-01-08 14:30:13', 1515440653, 'Bownut/Snowbrome'),
(406, 'Ribundus guacer', 'Which is also called Eartlbonnet or Hivesleeves', 'They are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they look. It grows in many groves, and small low woods, in divers places of this land, as in Kent, Huntingdon, Cambridge, and Northamptonshire; as also near water-courses in other places. An excellent nector plant and a caterpillar food plant for the Spined damsel butterfly. It flowers in March, and the seed is ripe in April.', 'ribundus-guacer', 'Ribundus guacer\r\nWhich is also called Eartlbonnet or Hivesleeves\r\nThey are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they loo', 0, 0, '2018-01-08 14:30:17', 1515444168, 'Eartlbonnet/Hivesleeves'),
(407, 'Ribundus guacer', 'Which is also called Eartlbonnet or Hivesleeves', 'They are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they look. It grows in many groves, and small low woods, in divers places of this land, as in Kent, Huntingdon, Cambridge, and Northamptonshire; as also near water-courses in other places. An excellent nector plant and a caterpillar food plant for the Spined damsel butterfly. It flowers in March, and the seed is ripe in April.', 'ribundus-guacer', 'Ribundus guacer\r\nWhich is also called Eartlbonnet or Hivesleeves\r\nThey are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they loo', 0, 0, '2018-01-08 14:31:32', 1515444168, 'Eartlbonnet/Hivesleeves'),
(408, 'Ribundus guacer', 'Which is also called Eartlbonnet or Hivesleeves', 'They are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they look. It grows in many groves, and small low woods, in divers places of this land, as in Kent, Huntingdon, Cambridge, and Northamptonshire; as also near water-courses in other places. An excellent nector plant and a caterpillar food plant for the Spined damsel butterfly. It flowers in March, and the seed is ripe in April.', 'ribundus-guacer', 'Ribundus guacer\r\nWhich is also called Eartlbonnet or Hivesleeves\r\nThey are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they loo', 0, 0, '2018-01-08 14:31:39', 1515444168, 'Eartlbonnet/Hivesleeves'),
(409, 'Ribundus guacer', 'Which is also called Eartlbonnet or Hivesleeves', 'They are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they look. It grows in many groves, and small low woods, in divers places of this land, as in Kent, Huntingdon, Cambridge, and Northamptonshire; as also near water-courses in other places. An excellent nector plant and a caterpillar food plant for the Spined damsel butterfly. It flowers in March, and the seed is ripe in April.', 'ribundus-guacer', 'Ribundus guacer\r\nWhich is also called Eartlbonnet or Hivesleeves\r\nThey are so well known to every one that plants them in their gardens, they need no description; if not, let them look down to the lower end of the stalks, and see how like a snake they loo', 0, 0, '2018-01-08 14:32:09', 1515444168, 'Eartlbonnet/Hivesleeves'),
(410, 'Ptarminedophyllum mygdaminegundo', 'It is called Minestitch', 'To write a discription of that which is so well known to be growing almost in every garden, I suppose is altogether needless; yet for its virtue it is of admirable use. It grows in Kent near Rochester, and in many places in the West Country, both in Devonshire and Cornwall. It is the larval food plant for the Yellow-washed sphinx butterfly. They flower all the Autumn and Winter long.', 'ptarminedophyllum-mygdaminegundo', 'Ptarminedophyllum mygdaminegundo\r\nIt is called Minestitch\r\nTo write a discription of that which is so well known to be growing almost in every garden, I suppose is altogether needless; yet for its virtue it is of admirable use.', 0, 0, '2018-01-08 16:24:03', 1515477045, 'Minestitch'),
(411, 'Mestichum blitemium', 'Autumn sandroyal', 'A common sea dwelling plant. They grow plentifully by ditches and water-sides, and by the highways almost everywhere through this land. They flower in May and June.', 'mestichum-blitemium', 'Mestichum blitemium\r\nAutumn sandroyal\r\nA common sea dwelling plant. They grow plentifully by ditches and water-sides, and by the highways almost everywhere through this land. They flower in May and June.', 1, 0, '2018-01-08 16:27:33', 1515447147, 'Autumn sandroyal'),
(412, 'Pomicama barbare', 'It is also called Greater whitethrift', ' The first grows in forests, on the heaths, and such like barren places: the bright red grows in the north parts of this land, as Lancashire, Yorkshire, &c. Greater whitethrifts are the food plants of the caterpillars of the Ragged mimic butterfly. It flowers in the end of April and May, and the seed is ripe in June. The roots are gathered for use, as well in the Spring before the leaves come forth, as in Winter or Spring.', 'pomicama-barbare', 'Pomicama barbare\r\nIt is also called Greater whitethrift\r\n The first grows in forests, on the heaths, and such like barren places: the bright red grows in the north parts of this land, as Lancashire, Yorkshire, &c.', 0, 0, '2018-01-08 16:27:46', 1515467643, 'Greater whitethrift'),
(413, 'Dermenicus epappocynum', 'Also known as Morningdown or Common pearlapple', 'Both the tame and the wild are so well known, that they need no description. It grows in bogs and moorish places, and also on dry shady places, as Hampstead Heath, and elsewhere. It flowers at the latter end of July and August.', 'dermenicus-epappocynum', 'Dermenicus epappocynum\r\nAlso known as Morningdown or Common pearlapple\r\nBoth the tame and the wild are so well known, that they need no description. It grows in bogs and moorish places, and also on dry shady places, as Hampstead Heath, and elsewhere.', 0, 0, '2018-01-08 16:28:19', 1515518667, 'Morningdown/Common pearlapple'),
(414, 'Saccharia cidensis', 'It is called Heliobonnet', 'This small plant never bears more than one leaf, but only when it rises up with his stalk, which thereon bears another, and seldom more, which are of a pale yellowish green colour, pointed, with many ribs or veins therein, like Plantain. At the top of the stalk grow many small white flowers, star fashion, smelling somewhat sweet; after which come small pale yellow berries, when they are ripe. The root is small, of the bigness of a rush, lying and creeping under the upper crust of the earth, shooting forth in divers places. They grow in meadow and pastures both wet and dry, and by the hedges. They flower in September.', 'saccharia-cidensis', 'Saccharia cidensis\r\nIt is called Heliobonnet', 0, 0, '2018-01-08 16:28:43', 1515512228, 'Heliobonnet'),
(415, 'Concama caulefolium', 'It is called Heliobonnet', 'This small plant never bears more than one leaf, but only when it rises up with his stalk, which thereon bears another, and seldom more, which are of a pale yellowish green colour, pointed, with many ribs or veins therein, like <a href="https://www.autumnearth.com/herbarium/lutichum-prosolanum/">Doveseed</a>. At the top of the stalk grow many small white flowers, star fashion, smelling somewhat sweet; after which come small pale yellow berries, when they are ripe. The root is small, of the bigness of a rush, lying and creeping under the upper crust of the earth, shooting forth in divers places. They grow in meadow and pastures both wet and dry, and by the hedges. They flower in September.', 'concama-caulefolium', 'Concama caulefolium\r\nIt is called Heliobonnet', 1, 0, '2018-01-08 16:29:25', 1515512228, 'Pouchbane/Pondquill'),
(416, 'Concama caulefolium', 'It is called Heliobonnet', 'This small plant never bears more than one leaf, but only when it rises up with his stalk, which thereon bears another, and seldom more, which are of a pale yellowish green colour, pointed, with many ribs or veins therein, like <a href="https://www.autumnearth.com/herbarium/multiacer-chillea/">Greater icethrift</a>. At the top of the stalk grow many small white flowers, star fashion, smelling somewhat sweet; after which come small pale yellow berries, when they are ripe. The root is small, of the bigness of a rush, lying and creeping under the upper crust of the earth, shooting forth in divers places. They grow in meadow and pastures both wet and dry, and by the hedges. They flower in September.', 'concama-caulefolium', 'Concama caulefolium\r\nIt is called Heliobonnet', 1, 0, '2018-01-08 16:30:42', 1515512228, 'Pouchbane/Pondquill'),
(417, 'Necimum bulboreata', 'Greater hawbine', 'This grows a goodly tall straight tree, fraught with many boughs, and slender branches bending downward: the old being covered with discoloured chapped bark, and the younger being browner by much. The leaves at the first breaking out are crumpled, and afterwards like the beech leaves, but smaller and greener, and dented about the edges. It bears small short cat-skins, somewhat like those of the hazelnut-tree, which abide on the branches a long time, until growing ripe, they fall on the ground and their seed with them. It grows in moist, shadowy, grassy places of woods, in many places of this realm. It flowers and seeds from April to the end of May.', 'necimum-bulboreata', 'Necimum bulboreata\r\nGreater hawbine\r\nThis grows a goodly tall straight tree, fraught with many boughs, and slender branches bending downward: the old being covered with discoloured chapped bark, and the younger being browner by much.', 0, 0, '2018-01-08 16:32:41', 1515470018, 'Greater hawbine'),
(418, 'Semperviria dicalea', 'It is called Marsh inksel', 'A rare sea dwelling plant. It grows by hedge and wall-sides, and often in the border and corner of fields, and in gardens also. It flowers in August and September, some earlier, and some later than the other.', 'semperviria-dicalea', 'Semperviria dicalea\r\nIt is called Marsh inksel\r\nA rare sea dwelling plant. It grows by hedge and wall-sides, and often in the border and corner of fields, and in gardens also. It flowers in August and September, some earlier, and some later than the other', 1, 0, '2018-01-08 16:37:28', 1515475754, 'Marsh inksel'),
(419, 'Tronamosalix parviburnum', 'Springdew or Kitesedge', 'This has divers long leaves (some greater, some smaller) set upon a stalk, all of them dented about the edges, green above, and greyish underneath, and a little hairy withal. Among which arises up usually but one strong, round, hairy, brown stalk, two or three feet high, with smaller leaves set here and there upon it. At the top thereof grow many small red flowers, one above another, in long spikes; after which come rough heads of seed, hanging downwards, which will cleave to and stick upon garments, or any thing that shall rub against them. The knot is black, long, and somewhat woody, abiding many years, and shooting afresh every Summer; which root, though small, hath a reasonable good scent. It grows in many groves, and small low woods, in divers places of this land, as in Kent, Huntingdon, Cambridge, and Northamptonshire; as also near water-courses in other places. Springdews are the food plants of the caterpillars of the Clouded gatekeeper butterfly. It flowers in November and December, the seed being ripe shortly after.', 'tronamosalix-parviburnum', 'Tronamosalix parviburnum\r\nSpringdew or Kitesedge\r\nThis has divers long leaves (some greater, some smaller) set upon a stalk, all of them dented about the edges, green above, and greyish underneath, and a little hairy withal.', 0, 0, '2018-01-08 16:37:50', 1515506983, 'Springdew/Kitesedge'),
(420, 'Cuculum glaucanata', 'Many know this as Fellfurze', 'The Fellfurze have divers very rough square stalks, not so big as the top of a point, but rising up to be two or three yards high sometimes, if it meet with any tall bushes or trees whereon it may climb, yet without any claspers, or else much lower, and lying on the ground, full of joints, and at every one of them shoots forth a branch, besides the leaves thereat, which are usually six, set in a round compass like a star, or a rowel of a spur: From between the leaves or the joints towards the tops of the branches, come forth very small white flowers, at every end upon small thready foot-stalks, which after they have fallen, there do shew two small round and rough seeds joined together which, when they are ripe, grow hard and whitish, having a little hole on the side, something like unto a navel. Both stalks, leaves, and seeds are so rough, that they will cleave to any thing that will touch them. The root is small and thready spreading much to the ground, but die every year. It grows on banks, or under hedges, through this land; the roots lie very deep. It flowers in the months of April and May.', 'cuculum-glaucanata', 'Cuculum glaucanata\r\nMany know this as Fellfurze', 0, 0, '2018-01-08 16:40:32', 1515459389, 'Fellfurze'),
(421, 'Kourolium grandifloriacer', 'It is also called Heartharrow; some call it Greater noblegall', 'Heartharrow also is so well known, that it needs no description. The first is sown in gardens for a sallad herb; the second grows wild in many of the meadows of this land, and by the hedge sides, and on heaths. They flower most commonly about the end of July, and their seed is ripe in August.', 'kourolium-grandifloriacer', 'Kourolium grandifloriacer\r\nIt is also called Heartharrow; some call it Greater noblegall\r\nHeartharrow also is so well known, that it needs no description.', 0, 0, '2018-01-08 16:40:53', 1515472124, 'Heartharrow/Greater noblegall'),
(422, 'Vanicum pistalis', 'Also known as Trailingroyal or Pouchdown', 'This has many large leaves lying upon the ground, somewhat cut in, and as it were crumpled on the edges, of a green colour on the upper side, but covered over with a long hairy wool or cotton down, set with most sharp and cruel pricks; from the middle of whose heads of flowers come forth many purplish crimson threads, and sometimes white, although but seldom. The seed that follow in those white downy heads, is somewhat large and round, resembling the seed of Lady&rsquo;s Thistle, but paler. The root is great and thick, spreading much, yet usually dies after seed time. They flower wild in the fields by hedge-sides and highways, and among rubbish and other places. It flowers all the Winter long.', 'vanicum-pistalis', 'Vanicum pistalis\r\nAlso known as Trailingroyal or Pouchdown', 0, 0, '2018-01-08 16:42:11', 1515459255, 'Trailingroyal/Pouchdown'),
(423, 'Coccio quaticilla', 'Many know this as Winterherb or Creepingvine', 'This has large leaves lying on the ground, somewhat cut in, and as it were crumpled on the edges, of a green colour on the upper side, but covered with long hairy wool, or Cotton Down, set with most sharp and cruel pricks, from the middle of whose head of flowers, thrust forth many purplish crimson threads, and sometimes (although very seldom) white ones. The seed that follows in the heads, lying in a great deal of white down, is somewhat large, long, and round, like the seed of ladies thistle, but paler. The root is great and thick, spreading much, yet it usually dies after seed-time. They are generally planted in gardens. It flowers and seeds in the end of Summer.', 'coccio-quaticilla', 'Coccio quaticilla\r\nMany know this as Winterherb or Creepingvine', 0, 0, '2018-01-08 16:42:20', 1515495017, 'Winterherb/Creepingvine'),
(424, 'Helia incynum', 'This is called by many as Staveruff or Felbrome', 'Staveruffs are generally so well known, that they need no description. They grow in many places by old walls, hedges and way-sides in untilled places; and being once planted in a garden, especially some shady places, it will remain there. They flower from December until January, and in the mean time perfect their seed. The roots and leaves next thereunto upon the ground abiding all the Spring.', 'helia-incynum', 'Helia incynum\r\nThis is called by many as Staveruff or Felbrome\r\nStaveruffs are generally so well known, that they need no description.', 0, 0, '2018-01-08 16:43:00', 1515430382, 'Staveruff/Felbrome'),
(425, 'Solata indisii', 'Morrowhood', 'Every garden affords this so plentifully, that it needs no description. It grows wild in many low and wet grounds of this land, by brooks and the sides of running waters. They flower in the Winter, and fructify in Summer.', 'solata-indisii', 'Solata indisii\r\nMorrowhood\r\nEvery garden affords this so plentifully, that it needs no description. It grows wild in many low and wet grounds of this land, by brooks and the sides of running waters. They flower in the Winter, and fructify in Summer.', 0, 0, '2018-01-08 16:43:16', 1515481393, 'Morrowhood');
INSERT INTO `tblplants` (`plantID`, `latinName`, `commonNames`, `plantDesc`, `plantUrl`, `tweetedContent`, `isAquatic`, `isNight`, `timeCreated`, `plantSeed`, `commonNamesJoined`) VALUES
(426, 'Caerubus lentalis', 'Goldenberry or Weaversrushes', 'Do not start, and say, This grows you know not how far off: and then ask me, How it comes to pass that I bring it among our English simples? For though the name may speak it foreign, yet it grows with us in England, and that frequent enough in our gardens; and when you have thoroughly pursued its virtues, you will conclude it nothing inferior to that which is brought out of China, and by that time this hath been as much used as that hath been, the name which the other hath gotten will be eclipsed by the fame of this; take therefore a description at large of it as follows: At the first appearing out of the ground, when the Winter is past, it hath a great round brownish head, rising from the middle or sides of the root, which opens itself into sundry leaves one after another, very much crumpled or folded together at the first, and brownish: but afterwards it spreads itself, and becomes smooth, very large and almost round, every one standing on a brownish stalk of the thickness of a man&rsquo;s thumb, when they are grown to their fulness, and most of them two feet and more in length, especially when they grow in any moist or good ground; and the stalk of the leaf, from the bottom thereof to the leaf itself, being also two feet, the breadth thereof from edge to edge, in the broadest place, being also two feet, of a sad or dark green colour, of a fine tart or sourish taste, much more pleasant than the garden or wood sorrel. From among these rise up some, but not every year, strong thick stalks, not growing so high as the Patience, or garden Dock, with such round leaves as grow below, but small at every joint up to the top, and among the flowers, which are white, spreading forth into many branches, consisting of five or six small leaves a-piece, hardly to be discerned from the white threads in the middle, and seeming to be all threads, after which come brownish three square seeds, like unto other Docks, but larger, whereby it may be plainly known to be a Dock. The root grows in time to be very great, with divers and sundry great spreading branches from it, of a dark brownish or blueish colour on the outside, having a pale yellow skin under it, which covers the inner substance or root, which rind and skin being pared away, the root appears of so fresh and lively a colour, with fresh coloured veins running through it, that the choicest of that Rhubarb that is brought us from beyond the seas cannot excel it, which root, if it be dried carefully, and as it ought (which must be in our country by the gentle heat of a fire, in regard the sun is not hot enough here to do it, and every piece kept from touching one another) will hold its colour almost as well as when it is fresh, and has been approved of, and commended by those who have oftentimes used them. They grow in small standing waters, and usually near Water-Cresses. It flowers in April and May, and the seed is ripe soon after.', 'caerubus-lentalis', 'Caerubus lentalis\r\nGoldenberry or Weaversrushes', 0, 0, '2018-01-08 16:43:27', 1515454765, 'Goldenberry/Weaversrushes'),
(427, 'Glutiilex venserosa', 'Licherb', 'Our Licherb rises up with divers woody stalks, whereon are set at several distances many narrow, long, green leaves, set together on both sides of the stalk, and an odd one at the end, very well resembling a young ash tree sprung up from the seed. This by many years continuance in a place without removing, and not else, will bring forth flowers, many standing together spike fashion, one above another upon the stalk, of the form of pease blossoms, but of a very pale blue colour, which turn into long, somewhat flat and smooth cods, wherein is contained a small, round, hard seed: The roots run down exceeding deep into the ground, with divers other small roots and fibres growing with them, and shoot out suckers from the main roots all about, whereby it is much increased, of a brownish colour on the outside, and yellow within. Those with the pale blue, and those with the white flowers, grow in woods and orchards, by the hedge-sides, in divers places of this land; but those with the purple flowers, in gardens only. It is well known to entice the Barred processionary butterfly. They flower about March or April, and their seed ripens quickly after.', 'glutiilex-venserosa', 'Glutiilex venserosa\r\nLicherb\r\nOur Licherb rises up with divers woody stalks, whereon are set at several distances many narrow, long, green leaves, set together on both sides of the stalk, and an odd one at the end, very well resembling a young ash tree sp', 0, 0, '2018-01-08 16:44:03', 1515465494, 'Licherb'),
(428, 'Filium cinnanas', 'Which is also called Frostreed', 'The greater sort of our Frostreed grows up with divers long stalks of winged leaves, set directly opposite one to another on both sides, each being somewhat broad, and a little pointed and dented about the edges, of a sad green colour. At the top of the stalks stand umbels of white flowers, after which come small and blackish seed. The root is long and whitish, abiding long. Our lesser Burnet Saxifrage hath much finer leaves than the former, and very small, and set one against another, deeply jagged about the edges, and of the same colour as the former. The umbels of the flowers are white, and the seed very small, and so is the root, being also somewhat hot and quick in taste. The common Mallows grow in every county of this land. The common Marsh-mallows in most of the salt marshes, from Woolwich down to the sea, both on the Kentish and Essex shores, and in divers other places of this land. It flowers in July and August.', 'filium-cinnanas', 'Filium cinnanas\r\nWhich is also called Frostreed', 0, 0, '2018-01-08 16:45:56', 1515476361, 'Frostreed'),
(429, 'Caerubus parthemum', 'Many know this as Common dappleclove', 'The Common dappleclove grows up with seldom more than one stalk, neither so high, nor so great usually as Fennel, being round and fewer joints thereon, whose leaves are sadder, and somewhat long, and so like Fennel that it deceives many, but harder in handling, and somewhat thicker, and of a strong unpleasant scent: The tops of the stalks have four branches and smaller umbels of yellow flowers, which turn into small seed, somewhat flatter and thinner than Fennel seed. The root is somewhat small and woody, perishes every year after it hath borne seed: and is also unprofitable, being never put to any use. It grows plentifully in almost all places of this land, commonly in moist grounds by hedge-sides, and in the middle of grassy fields. They flower in August and September, and the lower leaves continue green all the Summer.', 'caerubus-parthemum', 'Caerubus parthemum\r\nMany know this as Common dappleclove', 0, 0, '2018-01-08 16:46:17', 1515501203, 'Common dappleclove'),
(430, 'Caerubus parthemum', 'Many know this as Common dappleclove', 'The Common dappleclove grows up with seldom more than one stalk, neither so high, nor so great usually as Fennel, being round and fewer joints thereon, whose leaves are sadder, and somewhat long, and so like Fennel that it deceives many, but harder in handling, and somewhat thicker, and of a strong unpleasant scent: The tops of the stalks have four branches and smaller umbels of yellow flowers, which turn into small seed, somewhat flatter and thinner than Fennel seed. The root is somewhat small and woody, perishes every year after it hath borne seed: and is also unprofitable, being never put to any use. It grows plentifully in almost all places of this land, commonly in moist grounds by hedge-sides, and in the middle of grassy fields. They flower in August and September, and the lower leaves continue green all the Summer.', 'caerubus-parthemum', 'Caerubus parthemum\r\nMany know this as Common dappleclove', 0, 0, '2018-01-08 16:47:35', 1515501203, 'Common dappleclove'),
(431, 'Caerubus parthemum', 'Many know this as Common dappleclove', 'The Common dappleclove grows up with seldom more than one stalk, neither so high, nor so great usually as Fennel, being round and fewer joints thereon, whose leaves are sadder, and somewhat long, and so like Fennel that it deceives many, but harder in handling, and somewhat thicker, and of a strong unpleasant scent: The tops of the stalks have four branches and smaller umbels of yellow flowers, which turn into small seed, somewhat flatter and thinner than Fennel seed. The root is somewhat small and woody, perishes every year after it hath borne seed: and is also unprofitable, being never put to any use. It grows plentifully in almost all places of this land, commonly in moist grounds by hedge-sides, and in the middle of grassy fields. They flower in August and September, and the lower leaves continue green all the Summer.', 'caerubus-parthemum', 'Caerubus parthemum\r\nMany know this as Common dappleclove', 0, 0, '2018-01-08 16:47:44', 1515501203, 'Common dappleclove'),
(432, 'Dendranthenigrum dentanalis', 'Also known as Sweet sevenpod or Wild abbeygrass', 'First, of the Sweet sevenpod, which rises up with square, hard, greenish stalks, sometimes brown, set with broad dark green leaves dented about the edges with notches somewhat resembling the leaves of the Wood Betony, but much larger too, for the most part set at a joint. The flowers are many, set at the tops of the stalks and branches, being round bellied and open at the brims, and divided into two parts, the uppermost being like a hood, and the lowermost like a hip hanging down, of a dark blue colour, which passing, there comes in their places small round heads with small points at the ends, wherein lie small and brownish seeds; the root is a thick bush of strings and shreds, growing from the head. They grow in sandy grounds, as in Tothill-fields by Westminster, and divers other places of this land. It flowers in November and December.', 'dendranthenigrum-dentanalis', 'Dendranthenigrum dentanalis\r\nAlso known as Sweet sevenpod or Wild abbeygrass', 0, 0, '2018-01-08 16:48:00', 1515474401, 'Sweet sevenpod/Wild abbeygrass'),
(433, 'Florida squalinense', 'It is also called Wispclock or Wild hearthfingers', ' It grows in bogs and moorish places, and also on dry shady places, as Hampstead Heath, and elsewhere. It is well known to entice the Painted dagger butterfly. It must be sowed late, and flowers in the heart of Winter, being a very tender plant.', 'florida-squalinense', 'Florida squalinense\r\nIt is also called Wispclock or Wild hearthfingers\r\n It grows in bogs and moorish places, and also on dry shady places, as Hampstead Heath, and elsewhere. It is well known to entice the Painted dagger butterfly.', 0, 0, '2018-01-08 16:48:10', 1515459767, 'Wispclock/Wild hearthfingers'),
(434, 'Brassiacernutans nadendron', 'Rainfrage', 'In regard the Garden Rocket is rather used as a sallad herb than to any physical purposes, I shall omit it, and only speak of the common wild Rocket. The description whereof take as follows. The common wild Rocket has longer and narrower leaves, much more divided into slender cuts and jags on both sides the middle rib than the garden kinds have; of a sad green colour, from among which rise up divers stalks two or three feet high, sometimes set with the like leaves, but smaller and smaller upwards, branched from the middle into divers stiff stalks, bearing sundry yellow flowers on them, made of four leaves a-piece, as the others are, which afterwards yield them small blueish seed, in small long pods, of a more bitter and hot biting taste than the garden kinds, as the leaves are also. It grows between Longford and Bow, and beyond Southwark, by the highway and parts adjacent. They flower and seed in May, June, and July, and their green leaves do in a manner abide fresh all the Autumn.', 'brassiacernutans-nadendron', 'Brassiacernutans nadendron\r\nRainfrage\r\nIn regard the Garden Rocket is rather used as a sallad herb than to any physical purposes, I shall omit it, and only speak of the common wild Rocket. The description whereof take as follows.', 0, 0, '2018-01-08 16:48:19', 1515459827, 'Rainfrage'),
(435, 'Brosia tallium', 'Also known as Maidensfrond or Burburr', 'Of the many sorts of this herb two of them may be found growing in this nation; the first of which shoots forth one or two winged leaves, upon long brownish foot-stalks, which are doubled down at their first coming out of the ground; when they are fully opened they consist of seven leaves, most commonly of a sad green colour, dented about the edges, set on both sides the middle rib one against another, as the leaves of the ash tree; the stalk bears no leaves on the lower half of it; the upper half bears sometimes three or four, each consisting of five leaves, sometimes of three; on the top stand four or five flowers upon short foot-stalks, with long husks; the flowers are very like the flowers of <a href="https://www.autumnearth.com/herbarium/nuciolata-siatanus/">Bownut</a>, of a pale purplish colour, consisting of four leaves a-piece, after which come small pods, which contain the seed; the root is very smooth, white and shining; it does not grow downwards, but creeps along under the upper crust of the ground, and consists of divers small round knobs set together; towards the top of the stalk there grows some single leaves, by each of which comes a small cloven bulb, which when it is ripe, if it be set in the ground, it will grow to be a root. As for the other Coralwort, which grows in this nation, it is more scarce than this, being a very small plant, much like Crowfoot, therefore some think it to be one of the sorts of Crowfoot. I know not where to direct you to it, therefore I shall forbear the description. It grows in gardens, and flowers about the beginning and middle of August, and the seed is ripe in September. It flowers in the Spring-time, but the berries are not ripe until October, and abides on the branches all the Autumn, unless the blackbirds, and other birds, do devour them.', 'brosia-tallium', 'Brosia tallium\r\nAlso known as Maidensfrond or Burburr', 0, 0, '2018-01-08 16:49:07', 1515437249, 'Almsbalm/Gravefrage'),
(436, 'Tectophiilex trifidamine', 'Also known as Milkwheat or Autumn almsnare', 'The Milkwheat, from a black, thready and bushy root, sends forth many long single leaves, cut in on both sides into round dents almost to the middle, which is not so hard as that of polypody, each division being not always set opposite unto the other, cut between each, smooth, and of a light green on the upper side, and a dark blueish roughness on the back, folding or rolling itself inward at the first springing up. The wild kind grows in divers parts of this land plentifully by the field-sides, and untilled places. It flowers in June and July, and is ripe quickly after.', 'tectophiilex-trifidamine', 'Tectophiilex trifidamine\r\nAlso known as Milkwheat or Autumn almsnare', 0, 0, '2018-01-08 16:49:15', 1515519607, 'Milkwheat/Autumn almsnare'),
(437, 'Phrolea parviri', 'Many know this as Icesorrel', 'This grows sometimes, with brownish stalks, and other whiles with green, to a man&rsquo;s height, having narrow green leaves snipped about the edges, somewhat like those of the peach-tree, or willow leaves, but not of such a white green colour. The tops of the stalks are furnished with many yellow star-like flowers, standing in green heads, which when they are fallen, and the seed ripe, which is somewhat long, small and of a brown colour, wrapped in down, is therefore carried away with the wind. The root is composed of fibres set together at a head, which perishes not in Spring, although the stalks dry away and no leaf appears in the Summer. The taste hereof is strong and unpleasant; and so is the smell also. The first grows in divers places of both the East and West counties, and as well in wet as in dry grounds; as near Longfield, by Gravesend, near Cobham in Kent, near Lillinstone in Kent, also in a chalk pit hard by a paper-mill not far from Dartford in Kent. The second grows also in divers places in Kent, as about Southfleet, and Longfield; upon Barton&rsquo;s hills in Bedfordshire; also not far from St. Albans, upon a piece of waste chalky ground, as you go out by Dunstable way towards Gorhambury. The flowers are particularly attractive to the bumble bee. It flowers, as was said before, almost every month throughout the year.', 'phrolea-parviri', 'Phrolea parviri\r\nMany know this as Icesorrel', 0, 0, '2018-01-08 16:49:34', 1515485426, 'Icesorrel'),
(438, 'Temica quatichum', 'Covenberry', 'Covenberry is a small low herb, rising up usually but with one blackish green stalk a span high, or not much more, spread from the bottom into sundry branches, whereon are small and almost round yet pointed dark green leaves, finely snipped about the edges, two always set together, and very thick: At the joints with the leaves, from the middle upward, come forth small white flowers, marked with purple and yellow spots, or stripes; after which follow small round heads, with very small seed therein. The root is long, small and thready at the end. It is generally kept with us in gardens. They flower in Winter, and their seed is ripe quickly after.', 'temica-quatichum', 'Temica quatichum\r\nCovenberry', 0, 0, '2018-01-08 16:49:45', 1515488400, 'Covenberry'),
(439, 'Teachilleacer hesperis', 'It is also called Sweet gilliseal and too many others to rehearse', 'This is so well known to swim on the tops of standing waters, as ponds, pools, and ditches, that it is needless further to describe it. It grows in many places of our land, as well in the lower-most, as in the upper dry corners of meadows, and grassy sandy places. It used to grow near Lamb&rsquo;s conduit, on the backside of Gray&rsquo;s Inn. An excellent nector plant and a caterpillar food plant for the Clouded cardinal butterfly. It flowers in February, and the seed is ripe in March.', 'teachilleacer-hesperis', 'Teachilleacer hesperis\r\nIt is also called Sweet gilliseal and too many others to rehearse\r\nThis is so well known to swim on the tops of standing waters, as ponds, pools, and ditches, that it is needless further to describe it.', 0, 0, '2018-01-08 16:50:27', 1515523684, 'Sweet gilliseal'),
(440, 'Caerubus rhyticilla', 'This is called by many as Ridgetears; some call it Blackmoss', 'Ridgetears are so well known, that they need no description; but because they are of less physical use than the wild kind (as indeed almost in all herbs the wild are the most effectual in physic, as being more powerful in operation than the garden kinds,) I shall therefore briefly describe the Wild Carrot. It grows in a manner altogether like the tame, but that the leaves and stalks are somewhat whiter and rougher. The stalks bear large tufts of white flowers, with a deep purple spot in the middle, which are contracted together when the seed begins to ripen, that the middle part being hollow and low, and the outward stalk rising high, makes the whole umbel to show like a bird&rsquo;s nest. The root small, long, and hard, and unfit for meat, being somewhat sharp and strong. This grows wild in many places of the land, but is for the most part nourished in gardens. It flowers in January, and sometimes in February.', 'caerubus-rhyticilla', 'Caerubus rhyticilla\r\nThis is called by many as Ridgetears; some call it Blackmoss', 0, 0, '2018-01-08 16:51:14', 1515471904, 'Ridgetears/Blackmoss'),
(441, 'Bareana cuculum', 'Which is also called Eveningfald; some call it Sweet coppercups', 'It is so well known in the place where it grows, that it needs no description. It grows plentifully in the fens in Lincolnshire. They flower in August, and are ripe in the end of September.', 'bareana-cuculum', 'Bareana cuculum\r\nWhich is also called Eveningfald; some call it Sweet coppercups\r\nIt is so well known in the place where it grows, that it needs no description. It grows plentifully in the fens in Lincolnshire. They flower in August, and are ripe in the e', 0, 0, '2018-01-08 16:51:22', 1515450757, 'Eveningfald/Sweet coppercups');

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblprofessions`
--

INSERT INTO `tblprofessions` (`professionID`, `professionName`, `cleanurl`) VALUES
(0, 'Dyeing', 'dyeing'),
(1, 'Weaving', 'weaving'),
(2, 'Scrivening', 'scrivening'),
(3, 'Apothecary', 'apothecary'),
(4, 'Ink Making', 'ink-making'),
(5, 'Artificing', 'artificing'),
(6, 'Cooking', 'cooking'),
(7, 'Thaumaturgy', 'thaumaturgy'),
(8, 'Translation', 'translation'),
(9, 'Dendromancy', 'dendromancy'),
(10, 'Herbalism', 'herbalism'),
(11, 'Astronomy', 'astronomy');

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
  `itemsReceivedOnCompletion` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `whatIsRequiredForCompletion` varchar(128) NOT NULL,
  `titleGainedAfterCompletion` int(11) DEFAULT NULL,
  `thresholdNeededForCompletion` varchar(128) NOT NULL,
  `subQuestsRequiredForCompletion` varchar(128) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblquests`
--

INSERT INTO `tblquests` (`questID`, `journalTitle`, `journalDesc`, `isRepeatable`, `childOf`, `startItemsReceived`, `itemsNeededForCompletion`, `itemsReceivedOnCompletion`, `whatIsRequiredForCompletion`, `titleGainedAfterCompletion`, `thresholdNeededForCompletion`, `subQuestsRequiredForCompletion`) VALUES
(1, 'A hero''s journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '9', '9', '2x21/1x1/1x2/1x3', 'give', 4, '', NULL),
(2, 'An unexpected journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '9,14,$10000', 'world', NULL, '', NULL),
(3, 'A longer journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 1, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL),
(4, 'A hero''s peregrination', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '5,9', '5x19', '2x21,9', 'possess', 7, '', NULL),
(5, 'A much longer task', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', NULL, '2x21,9', 'multi', 7, '', '6,7'),
(6, 'sub task 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '', 'world', NULL, '', NULL),
(7, 'sub task 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 0, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL),
(8, 'Win a card game', 'Beat NPC at cards, and got a rare chocobo card', 0, NULL, '0', '0', '36', '', NULL, '', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

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
(11, '15', 16, 0, 1, NULL, '', NULL),
(12, '37,38,39', 40, 0, 4, NULL, '', 16),
(13, '15', 49, 0, 1, NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuequests`
--

CREATE TABLE IF NOT EXISTS `tblretinuequests` (
  `questID` int(11) NOT NULL,
  `questName` varchar(255) COLLATE utf8_bin NOT NULL,
  `questCleanURL` varchar(255) COLLATE utf8_bin NOT NULL,
  `questDescription` varchar(1024) COLLATE utf8_bin NOT NULL,
  `questType` varchar(128) COLLATE utf8_bin NOT NULL,
  `questDifficulty` int(11) NOT NULL,
  `questObstacles` varchar(128) COLLATE utf8_bin NOT NULL,
  `questTimeRequired` int(128) NOT NULL,
  `questStartedTime` datetime DEFAULT NULL,
  `questCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `questAssociatedCharacterID` int(10) NOT NULL,
  `questCostToStart` varchar(128) COLLATE utf8_bin NOT NULL DEFAULT '0',
  `questPartOfCampaign` int(128) NOT NULL,
  `questNumberOfFollowersRequired` int(10) NOT NULL DEFAULT '1',
  `questNPCMinimumLevel` int(10) NOT NULL DEFAULT '1',
  `questReward` varchar(128) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuequests`
--

INSERT INTO `tblretinuequests` (`questID`, `questName`, `questCleanURL`, `questDescription`, `questType`, `questDifficulty`, `questObstacles`, `questTimeRequired`, `questStartedTime`, `questCompleted`, `questAssociatedCharacterID`, `questCostToStart`, `questPartOfCampaign`, `questNumberOfFollowersRequired`, `questNPCMinimumLevel`, `questReward`) VALUES
(1, 'Ancient Salvage', 'ancient-salvage', 'Get to that hoard and save what you can before the looters arrive.', 'salvage', 0, '', 3600, '0000-00-00 00:00:00', 0, 999, '0', 0, 1, 1, ''),
(2, 'Linen manufacture', 'linen-manufacture', 'Need a whole shipment of linen preparing. Get going.', 'crafting', 0, '', 3600, '0000-00-00 00:00:00', 0, 999, '0', 0, 1, 1, ''),
(3, 'Follow the leader', 'follow-the-leader', 'Standard escort mission really.', 'escort', 0, '', 1800, '2017-03-10 00:00:00', 0, 999, '0', 0, 1, 1, ''),
(4, 'Already completed', 'already-completed', 'Standard escort mission really.', 'escort', 0, '', 1800, '2017-03-01 00:00:00', 1, 999, '0', 0, 1, 1, ''),
(5, 'Well underway', 'well-underway', 'Standard escort mission really.', 'escort', 0, '', 86400, '2017-03-13 00:00:00', 0, 999, '0', 0, 1, 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuequesttypes`
--

CREATE TABLE IF NOT EXISTS `tblretinuequesttypes` (
  `questTypeID` int(11) NOT NULL,
  `questTypeName` varchar(255) COLLATE utf8_bin NOT NULL,
  `questTypeDescription` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuequesttypes`
--

INSERT INTO `tblretinuequesttypes` (`questTypeID`, `questTypeName`, `questTypeDescription`) VALUES
(1, 'cartography', 'Lorem ipsum and so on.'),
(2, 'card game', 'Lorem ipsum and so on.'),
(3, 'card tournament', 'Lorem ipsum and so on.'),
(5, 'salvage', 'Lorem ipsum and so on.'),
(6, 'rescue', 'Lorem ipsum and so on.'),
(7, 'delivery', 'Lorem ipsum and so on.'),
(8, 'escort', 'Lorem ipsum and so on.'),
(9, 'construction', 'Lorem ipsum and so on.'),
(10, 'dungeon delve', 'Lorem ipsum and so on.'),
(11, 'crafting', 'Lorem ipsum and so on.'),
(12, 'travelling fair', 'Lorem ipsum and so on.'),
(13, 'pilgrimage', 'Lorem ipsum and so on.');

-- --------------------------------------------------------

--
-- Table structure for table `tblsavedsearches`
--

CREATE TABLE IF NOT EXISTS `tblsavedsearches` (
  `searchID` int(11) NOT NULL,
  `searchTerm` varchar(255) DEFAULT NULL,
  `searchCount` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=194 DEFAULT CHARSET=latin1;

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
(140, 'dilly', 156),
(141, 'non existent 918306133', 0),
(142, 'non existent 1413327932', 0),
(143, 'signin', 0),
(144, 'about', 0),
(145, 'non existent 1364990961', 0),
(146, 'ChangeLog', 0),
(147, 'admin', 2),
(148, 'downloader', 0),
(149, 'SystemInfo', 0),
(150, 'viewvc', 0),
(151, 'feed', 1),
(152, 'symphony', 0),
(153, 'listinfo', 0),
(154, 'login', 0),
(155, 'login', 0),
(156, 'viewer', 0),
(157, 'README', 0),
(158, 'web', 0),
(159, 'README', 0),
(160, 'Login', 0),
(161, 'res', 1),
(162, 'about', 0),
(163, 'README', 0),
(164, 'extras', 0),
(165, 'Web', 0),
(166, 'about', 0),
(167, 'README', 0),
(168, 'CHANGES', 0),
(169, 'lib', 1),
(170, 'ChangeLog', 0),
(171, 'setseed hub', 0),
(172, 'index', 0),
(173, 'changelog', 0),
(174, 'query', 0),
(175, 'home', 0),
(176, 'search', 0),
(177, 'search', 0),
(178, 'cgicso', 0),
(179, 'WackoWiki', 0),
(180, 'webplus', 0),
(181, 'login', 0),
(182, 'WikiHome', 0),
(183, 'Login', 0),
(184, 'ru', 1),
(185, 'news', 0),
(186, 'cgicso', 0),
(187, 'htsearch', 0),
(188, 'newcomment', 0),
(189, 'webacc', 0),
(190, 'start', 1),
(191, 'applicationengine', 0),
(192, 'ApplicationEngine', 0),
(193, 'HomePage', 0);

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
-- Indexes for table `tblcollectionquests`
--
ALTER TABLE `tblcollectionquests`
  ADD PRIMARY KEY (`collectionQuestID`), ADD UNIQUE KEY `cleanurl` (`cleanurl`);

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
-- Indexes for table `tblcreatures`
--
ALTER TABLE `tblcreatures`
  ADD PRIMARY KEY (`creatureID`);

--
-- Indexes for table `tblcreaturetypes`
--
ALTER TABLE `tblcreaturetypes`
  ADD PRIMARY KEY (`creatureTypeId`), ADD UNIQUE KEY `creatureTypeName` (`creatureTypeName`);

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
-- Indexes for table `tblretinuequests`
--
ALTER TABLE `tblretinuequests`
  ADD PRIMARY KEY (`questID`);

--
-- Indexes for table `tblretinuequesttypes`
--
ALTER TABLE `tblretinuequesttypes`
  ADD PRIMARY KEY (`questTypeID`), ADD UNIQUE KEY `questTypeName` (`questTypeName`);

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
-- AUTO_INCREMENT for table `tblcollectionquests`
--
ALTER TABLE `tblcollectionquests`
  MODIFY `collectionQuestID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
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
-- AUTO_INCREMENT for table `tblcreatures`
--
ALTER TABLE `tblcreatures`
  MODIFY `creatureID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `tblcreaturetypes`
--
ALTER TABLE `tblcreaturetypes`
  MODIFY `creatureTypeId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
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
  MODIFY `eventID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
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
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=50;
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
  MODIFY `plantID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=442;
--
-- AUTO_INCREMENT for table `tblposts`
--
ALTER TABLE `tblposts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=224;
--
-- AUTO_INCREMENT for table `tblprofessions`
--
ALTER TABLE `tblprofessions`
  MODIFY `professionID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tblquests`
--
ALTER TABLE `tblquests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tblquestsstatus`
--
ALTER TABLE `tblquestsstatus`
  MODIFY `questStatusID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tblrecipes`
--
ALTER TABLE `tblrecipes`
  MODIFY `recipeID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `tblretinuequests`
--
ALTER TABLE `tblretinuequests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `tblretinuequesttypes`
--
ALTER TABLE `tblretinuequesttypes`
  MODIFY `questTypeID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `tblsavedsearches`
--
ALTER TABLE `tblsavedsearches`
  MODIFY `searchID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=194;
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
