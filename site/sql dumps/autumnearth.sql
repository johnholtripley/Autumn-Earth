-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2020 at 05:50 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.0.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autumnearth`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblacct`
--

CREATE TABLE `tblacct` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblacct`
--

INSERT INTO `tblacct` (`accountID`, `accountName`, `accountStatus`, `joinedTime`, `accountType`, `postCount`, `currentCharID`, `email`, `birthday`, `subscribeNews`, `subscribeUpdates`, `password`, `signature`, `htmlemail`, `emailalerts`, `uniqueID`, `usersIPAddress`) VALUES
(5, 'seawarrior', '2', '2006-07-06 21:49:41', '0', 89, 1, 'john.holtripley@gmail.com', '2006-07-29 18:16:14', '1', '1', 'ý¨âù­D;ùÉ“>hpTéÛ', '[u]warrior[/u] from the sea :)', '1', '1', '49a3805132045cc65b4b5ab43568fd2f', NULL),
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
(39, 'dilly4', '2', '2015-06-30 12:16:37', '0', 2, 14, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'F', 'dilly\'s sig', '1', '1', '9c8fe4a786a619ae2a79f8e7a30b0903', '127.0.0.1'),
(40, 'dilly5', '2', '2015-07-01 12:49:57', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'F', 'hi', '1', '1', 'c10714bb83b8f9e435846ca4d7f4de5a', '127.0.0.1'),
(41, 'dilly6', '2', '2015-07-01 12:52:56', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'dd', '1', '1', 'cc795b52a79da76c0ec6c2fb8a47139f', '127.0.0.1'),
(42, 'dilly7', '2', '2015-07-01 12:56:40', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'q\r', 'dfd ', '1', '1', '5c06003a835996f6e991ba9c9d07f213', '127.0.0.1'),
(43, 'dilly8', '2', '2015-07-01 12:57:46', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'dfg dfg', '1', '1', '73f6a7e241495b62ef7837d896920f71', '127.0.0.1'),
(44, 'dilly9', '2', '2015-07-01 12:58:53', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'fdg df', '1', '1', '5f5fc9793149b4e2fbd5890bde7e4255', '127.0.0.1'),
(45, 'dilly10', '2', '2015-07-01 13:03:34', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '', 'sad', '1', '1', '53f84406edc486c2ecfba47066b306a7', '127.0.0.1'),
(46, 'dilly11', '2', '2015-07-01 13:07:28', '0', 0, 1, 'john.holtripley@gmail.com', '2001-05-01 00:00:00', '1', '1', 'nÝ|•ÇG©”ª !²n‹*', 'ddd sdas das dsad ', '1', '1', '1bf279b495f3db4e193db87bc53fcd60', '127.0.0.1'),
(47, 'dilly12', '2', '2015-07-01 13:10:38', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '`ézz[£WÝu\raôÝ§', 'dilly12', '1', '1', '0b6ad46b1589a181e0402562c0b1d9e1', '127.0.0.1'),
(48, 'dilly20', '2', '2015-07-03 14:02:41', '0', 13, 15, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'ÞÉ/ê;}6Ôx|Ökd', 'dilly20', '1', '1', '3dcbb605f6e3545f33d0e1fe54042f97', '127.0.0.1'),
(49, 'dilly21', '2', '2015-07-03 14:03:09', '0', 0, 16, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', 'œé+\'ÍÍiffA`jÔ@', 'dilly21', '1', '1', '55561f21c5445a16e9e306fae400b08c', '127.0.0.1'),
(50, 'dilly22', '2', '2015-08-04 15:10:24', '0', 0, 1, 'john.holtripley@gmail.com', '2007-04-03 00:00:00', '1', '1', '.{[ÄX%tl¢\"ÔÉF', 'sdsd', '1', '1', 'fb4d713852301b8dff21ff63f376b45f', '127.0.0.1'),
(51, 'test', '2', '2015-11-20 14:31:58', '0', 0, 1, 'john.holtripley@gmail.com', '2015-01-01 00:00:00', '1', '1', '®)ª¹ì?¨åÑ·“¯ä¥', '', '1', '1', '9c7129e26978a03b58eb1a6375c50067', '127.0.0.1'),
(52, 'JohnHoltRipley', '2', '2018-12-17 13:07:38', '0', 0, 999, 'john.holtripley@gmail.com', '2018-01-01 00:00:00', '1', '1', 'ÖIÁasü·µ¯½±´', 'hi', '1', '1', 'dc70c88ec46664ec01f5fe6a92cacf5c', '127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `tblauctionbids`
--

CREATE TABLE `tblauctionbids` (
  `bidID` int(11) NOT NULL,
  `auctionID` int(11) DEFAULT NULL,
  `bidderID` int(11) DEFAULT NULL,
  `bidAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblauctionitems` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Table structure for table `tblcardbacks`
--

CREATE TABLE `tblcardbacks` (
  `cardBackID` int(11) NOT NULL,
  `cardBackName` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcardbacks`
--

INSERT INTO `tblcardbacks` (`cardBackID`, `cardBackName`) VALUES
(0, 'Default'),
(1, 'Beginners'),
(2, 'Vortex'),
(3, 'Golden'),
(4, 'Christmas Gingerbread'),
(5, 'Astral'),
(6, 'Inn #1');

-- --------------------------------------------------------

--
-- Table structure for table `tblcards`
--

CREATE TABLE `tblcards` (
  `cardID` int(11) NOT NULL,
  `cardAttack` int(2) NOT NULL,
  `cardDefense` int(2) NOT NULL,
  `cardName` varchar(255) COLLATE utf8_bin NOT NULL,
  `cardCraftingCost` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblcards`
--

INSERT INTO `tblcards` (`cardID`, `cardAttack`, `cardDefense`, `cardName`, `cardCraftingCost`) VALUES
(1, 5, 10, 'Bomb', 20),
(2, 5, 10, 'Chocobo', 20),
(3, 5, 10, 'Mog', 25),
(4, 5, 10, 'Cactuar', 20),
(5, 5, 10, 'Shiva', 50),
(6, 5, 10, 'Tonberry', 20),
(7, 5, 10, 'Slime', 20);

-- --------------------------------------------------------

--
-- Table structure for table `tblcharacters`
--

CREATE TABLE `tblcharacters` (
  `charID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `charName` varchar(25) DEFAULT NULL,
  `cleanURL` varchar(128) NOT NULL,
  `tileX` int(11) NOT NULL,
  `tileY` int(11) NOT NULL,
  `bags` longtext NOT NULL,
  `inventory` longtext NOT NULL,
  `titlesEarned` longtext NOT NULL,
  `activeTitle` int(11) NOT NULL,
  `professionsKnown` varchar(255) NOT NULL,
  `activeQuests` varchar(255) NOT NULL DEFAULT '[]',
  `recipesKnown` longtext NOT NULL,
  `holding` longtext NOT NULL,
  `activeTreasureMaps` varchar(255) NOT NULL DEFAULT '[]',
  `plantCrossesKnown` longtext,
  `totalGameTimePlayed` int(11) NOT NULL,
  `cards` longtext NOT NULL,
  `cardBacks` longtext NOT NULL,
  `activeCardBack` int(4) NOT NULL,
  `stats` longtext NOT NULL,
  `settings` longtext NOT NULL,
  `fae` longtext NOT NULL,
  `activePets` longtext NOT NULL,
  `allPets` longtext NOT NULL,
  `currency` longtext NOT NULL,
  `npcsFollowing` varchar(255) NOT NULL,
  `lineOfSightRange` int(11) NOT NULL,
  `retinueMapAreasRevealed` longtext NOT NULL,
  `collections` longtext NOT NULL,
  `catalogues` longtext NOT NULL,
  `actions` longtext NOT NULL,
  `guildID` int(11) DEFAULT '0',
  `guildmembersince` date DEFAULT NULL,
  `404MagicSquareSum` varchar(255) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblcharacters`
--

INSERT INTO `tblcharacters` (`charID`, `accountID`, `charName`, `cleanURL`, `tileX`, `tileY`, `bags`, `inventory`, `titlesEarned`, `activeTitle`, `professionsKnown`, `activeQuests`, `recipesKnown`, `holding`, `activeTreasureMaps`, `plantCrossesKnown`, `totalGameTimePlayed`, `cards`, `cardBacks`, `activeCardBack`, `stats`, `settings`, `fae`, `activePets`, `allPets`, `currency`, `npcsFollowing`, `lineOfSightRange`, `retinueMapAreasRevealed`, `collections`, `catalogues`, `actions`, `guildID`, `guildmembersince`, `404MagicSquareSum`) VALUES
(1, 5, 'Angel', 'angel', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '9|17|56'),
(3, 5, 'Alice', 'alice', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(4, 23, 'Eric', 'eric', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(5, 13, 'Adminchar1', 'adminchar1', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(6, 13, 'Adminchar2', 'adminchar2', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(7, 14, 'modchar1', 'modchar1', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(8, 14, 'modchar2', 'modchar2', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(9, 15, 'johnchar1', 'johnchar1', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(10, 18, 'newmemberchar1', 'newmemberchar1', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2007-03-30', '-1'),
(14, 39, 'eleaddaiMeow', 'eleaddaimeow', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2015-06-30', '-1'),
(15, 39, 'dilly20', 'dilly20', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '1,2,3,1,2,1,1,1,2,1,2,3', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2015-06-30', '10|38|60'),
(16, 39, 'dilly21', 'dilly21', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2015-06-30', '-1'),
(17, 50, 'dilly22', 'dilly22', 0, 0, '', '', '', 0, '', '[]', '', '', '[]', NULL, 0, '', '', 0, '', '', '', '', '', '', '', 0, '', '', '', '', 0, '2015-06-30', '-1'),
(999, 52, 'Eleaddai', 'eleaddai', 73, 230, '[{\"type\":20,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},{\"type\":17,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', '{\"0-0\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902271848\"},\"0-1\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902291002\"},\"0-2\":{\"type\":5,\"quantity\":9,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902334721\"},\"0-20\":{\"type\":63,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"type\":65,\"quantity\":4,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100}],\"hash\":\"3149991999902334723\"},\"0-21\":{\"type\":64,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991998902334721\"},\r\n\r\n\"0-13\":{\"type\":57,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"5719963531567007915104\"},\r\n\"0-14\":{\"type\":86,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"5719963531567007915104\"},\r\n\r\n\r\n\"1-11\":{\"type\":56,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"571996353170483782567007915104\"},\r\n\r\n\r\n\"0-28\":{\"type\":110,\"quantity\":4,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"5719963531704837656565682567007915104\"},\r\n\"0-29\":{\"type\":111,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"name\":\"Small hawk from Egg\",\"src\":\"hawk.png\",\"width\":20,\"length\":20,\"spriteWidth\":62,\"spriteHeight\":67,\"centreX\":33,\"centreY\":87,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":       {\r\n                    \"wait\":\r\n                    {\r\n                        \"length\": 11,\r\n                          \"n\": 0,\r\n                        \"e\": 1,                     \r\n                        \"s\": 2,\r\n                         \"w\": 3\r\n                    },\r\n                    \"moving\":\r\n                    {\r\n                        \"length\": 11,\r\n                          \"n\": 0,\r\n                        \"e\": 1,                     \r\n                        \"s\": 2,\r\n                         \"w\": 3\r\n                    }\r\n                },\"state\":\"wait\",\"breadcrumb\":[],\"drawnFacing\":\"n\",\"pathIndex\":1}],\"hash\":\"5712399691704837656565682567007915104\"},\r\n\r\n\"0-22\":{\"type\":66,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"114894651998902334721\"},\r\n\"0-23\":{\"type\":68,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489465199890233453465321\"},\r\n\r\n\"0-18\":{\"type\":70,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1148946519989023367674721\"},\r\n\"0-19\":{\"type\":72,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463453465321\"},\r\n\r\n\"1-12\":{\"type\":34,\"quantity\":2,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463dfggfd453465321\",\"contains\":3},\r\n\"1-13\":{\"type\":34,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463dfggfd4534999965321\",\"contains\":-2},\r\n\r\n\"1-14\":{\"type\":81,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1148946345345567788653244432423321\",\"contains\":{\"ugc-id\":\"3\",\"ugc-title\":\"Eleaddai\'s Custom Card\"}},\r\n\r\n\"1-17\":{\"type\":84,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1148946345345567788653244434534532423321\",\"contains\":{\"catalogueName\":\"common-plants\",\"required\":[1,2,3,6]}},\r\n\r\n\"1-3\":{\"type\":80,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"114894634534653244432423321\",\"contains\":{\"ugc-id\":\"2\",\"ugc-title\":\"Titian\'s Venus\"}},\r\n\r\n\r\n\"1-16\":{\"type\":82,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463dfggfd4534999gfhgfh965321\",\"contains\":\"34_28\"},\r\n\r\n\r\n\"0-3\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902358469\"},\"0-9\":{\"type\":12,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902379274\"},\"0-8\":{\"type\":12,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":6,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902396179\"},\"0-4\":{\"type\":9,\"quantity\":8,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902425351\"},\"0-5\":{\"type\":10,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902445101\"},\"0-6\":{\"type\":8,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902469179\"},\"0-7\":{\"type\":11,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902489049\"},\"p0-3\":{\"type\":55,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"A quest book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>You\'ve just started a new quest. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"},\"hash\":\"1149991538902537077\"},\"0-10\":{\"type\":33,\"quantity\":10,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902557653\"},\"0-12\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902588374\"},\"0-16\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902609376\"},\"1-1\":{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902627456\"},\"1-2\":{\"type\":21,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902650113\"},\"1-4\":{\"type\":29,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902671831\",\"contains\":9},\"1-5\":{\"type\":30,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902689349\"},\"1-6\":{\"type\":13,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902728964\"},\"0-11\":{\"type\":20,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902751592\"},\"1-7\":{\"type\":33,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"An old book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"},\"hash\":\"1149991538902773110\"},\"1-8\":{\"type\":31,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"type\":28,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}],\"hash\":\"1149991538902817652\"},\"1-9\":{\"type\":32,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"Another old book\",\"timeCreated\":\"1489052678002\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>\'Wow! wow! wow!\' While the Owl had the door of which was the Hatter.<\\/p><p> \'You ought to eat or drink under the window, she suddenly spread out her hand on the floor, and a bright brass plate with the dream of Wonderland of long ago: and how she would keep, through all her wonderful Adventures, till she got to do,\' said the Pigeon in a natural way again.<\\/p><p> That\'s all.\' \'In that direction,\' the Cat.<\\/p><\\/section><section><h1>Chapter 2<\\/h1><p>\'Off with her friend.<\\/p><p> When she got to go and get ready to sink into the book her sister sat still just as well as if she were looking over their slates; \'but it sounds uncommon nonsense.\' Alice didn\'t think that there was nothing so very tired of this.<\\/p><p> I think it was,\' the March Hare said\\u2014\' \'I didn\'t!\' the March Hare and the beak\\u2014 Pray how did you call it purring, not growling,\' said Alice.<\\/p><\\/section>\"},\"hash\":\"1149991538902847955\",\"additional\":{\"quest\":2,\"recipe\":7}},\"1-18\":{\"type\":53,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902888722\",\"additional\":\"14|4|4\",\"cooldown\":500,\"cooldownTimer\":0},\"1-19\":{\"type\":32,\"quantity\":5,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902907868\"},\"1-10\":{\"type\":41,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902922109\"},\"0-17\":{\"type\":5,\"quantity\":1,\"quality\":8,\"durability\":45,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902937865\"},\"0-15\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902957225\"}}', '[3,7]', 7, '[0,1]', '[]', '[0,1,2,3,10,11,7,6,12,13,8,14]', '{\"hash\":\"\",\"type\":\"\",\"quickHoldIndex\":0}', '[]', '[\"67-74\"]', 35784, '[6,5,4,4,4,-2,4,4,4,4,4,4,4,4,4]', '[2,5]', 2, '{\"cardGamesWon\":2,\"cardGamesLost\":4,\"cardGamesDrawn\":0,\"cardGamesPlayed\":6,\"numberOfcardsFlipped\":8,\"retinueMissionsCompleted\":0,\"retinueExplorationMissionsCompleted\":5,\"itemsCrafted\":0,\"itemsGathered\":0,\"hnefataflGamesWon\":2,\"hnefataflGamesLost\":4,\"hnefataflGamesDrawn\":0,\"hnefataflGamesPlayed\":6}', '{\"soundVolume\":\"1\",\"musicVolume\":\"0.6\",\"showFootprintInEditMode\":true}', '{\"range\":4950,\"speed\":4}', '[]', '[{\"name\":\"White Hen\",\"src\":\"white-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":34,\"spriteHeight\":37,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":26,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1272,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[],\"drawnFacing\":\"n\",\"pathIndex\":1},{\"name\":\"Brown Hen\",\"src\":\"brown-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":34,\"spriteHeight\":37,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":28,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1368,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[],\"drawnFacing\":\"n\",\"pathIndex\":1}]', '{\"money\":3412510,\"cardDust\":49,\"keys\":[]}', '[]', 20, '[\"-3,2\",\"-2,1\",\"-2,2\",\"-1,1\",\"-3,1\",\"-2,3\",\"-3,0\",\"-1,3\",\"-1,2\"]', '[]', '[]', '[[\"Harmful extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-40}],[\"Gentle extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-50}],\"-\",[\"Cross pollinate plants\",\"plant-breeding\",null,[]],[\"Dowse for metals\",\"dowse\",4,{\"range\":30}],[\"Survey for metals\",\"survey\",4,{\"time\":-500}],[\"Mineral extraction\",\"gather\",4,{\"time\":1500,\"purity\":10,\"quality\":-40}],\"-\",[\"Identify\",\"identify\",null,{\"type\":\"plants\"}],[\"Mount\",\"mount\",null,{\"pet-name\":\"brown horse\"}]]', 0, '2007-03-30', '-1'),
(1000, 5, 'Eleaddai-copy', 'eleaddai-copy', 5, 26, '[{\"type\":20,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},{\"type\":17,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', '{\"0-0\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-1\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-2\":{\"type\":5,\"quantity\":9,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-3\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-9\":{\"type\":12,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-8\":{\"type\":12,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":6,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-4\":{\"type\":9,\"quantity\":8,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-5\":{\"type\":10,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-6\":{\"type\":8,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-7\":{\"type\":11,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"p0-2\":{\"type\":36,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"p0-3\":{\"type\":55,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"A quest book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>You\'ve just started a new quest. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"}},\"0-10\":{\"type\":33,\"quantity\":10,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-12\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-16\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-1\":{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-2\":{\"type\":21,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-4\":{\"type\":29,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-5\":{\"type\":30,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-6\":{\"type\":13,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-11\":{\"type\":20,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-7\":{\"type\":33,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"An old book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"}},\"1-8\":{\"type\":31,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"type\":28,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]},\"1-9\":{\"type\":32,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"Another old book\",\"timeCreated\":\"1489052678002\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>\'Wow! wow! wow!\' While the Owl had the door of which was the Hatter.<\\/p><p> \'You ought to eat or drink under the window, she suddenly spread out her hand on the floor, and a bright brass plate with the dream of Wonderland of long ago: and how she would keep, through all her wonderful Adventures, till she got to do,\' said the Pigeon in a natural way again.<\\/p><p> That\'s all.\' \'In that direction,\' the Cat.<\\/p><\\/section><section><h1>Chapter 2<\\/h1><p>\'Off with her friend.<\\/p><p> When she got to go and get ready to sink into the book her sister sat still just as well as if she were looking over their slates; \'but it sounds uncommon nonsense.\' Alice didn\'t think that there was nothing so very tired of this.<\\/p><p> I think it was,\' the March Hare said\\u2014\' \'I didn\'t!\' the March Hare and the beak\\u2014 Pray how did you call it purring, not growling,\' said Alice.<\\/p><\\/section>\"}},\"1-18\":{\"type\":53,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"additional\":\"2|4|4\",\"cooldown\":500,\"cooldownTimer\":0},\"1-19\":{\"type\":32,\"quantity\":5,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"1-10\":{\"type\":41,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-17\":{\"type\":5,\"quantity\":1,\"quality\":8,\"durability\":45,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},\"0-15\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}}', '[3,7]', 3, '[0,1]', '[]', '[0,1,2,3,10,11,7,6,12,13,8,14]', '', '[]', '[\"1-5\",\"5-23\",\"67-71\"]', 34508, '[6,5,4,4,4,4,4,4,4,4,4,4,4,4,4]', '', 0, '{\"cardGamesWon\":2,\"cardGamesLost\":4,\"cardGamesDrawn\":0,\"numberOfcardsFlipped\":8,\"retinueMissionsCompleted\":0,\"retinueExplorationMissionsCompleted\":4,\"itemsCrafted\":0,\"itemsGathered\":0}', '{\"soundVolume\":\"1\",\"musicVolume\":\"0\"}', '{\"range\":4950,\"speed\":4}', '[0,1]', '[{\"name\":\"White Hen\",\"src\":\"white-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":28,\"spriteHeight\":34,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":26,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1272,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[[26,26],[26,27],[26,28],[26,27],[26,26],[26,25],[26,24],[26,23],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22]],\"drawnFacing\":\"n\",\"pathIndex\":1},{\"name\":\"Brown Hen\",\"src\":\"brown-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":28,\"spriteHeight\":34,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":28,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1368,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[[26,28],[26,29],[26,30],[26,29],[26,28],[26,27],[26,26],[26,25],[26,24],[26,23],[26,23],[26,23],[26,23],[26,23],[26,23],[26,23]],\"drawnFacing\":\"n\",\"pathIndex\":1}]', '{\"money\":3412510,\"cardDust\":12,\"keys\":[]}', '[]', 20, '[\"-3,2\",\"-2,1\",\"-2,2\",\"-1,1\",\"-3,1\",\"-2,3\",\"-3,0\",\"-1,3\"]', '[]', '[]', '[[\"Harmful extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-40}],[\"Gentle extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-50}],\"-\",[\"Cross pollinate plants\",\"plant-breeding\",null,[]],[\"Dowse for metals\",\"dowse\",4,{\"range\":30}],[\"Survey for metals\",\"survey\",4,{\"time\":-500}],[\"Mineral extraction\",\"gather\",4,{\"time\":1500,\"purity\":10,\"quality\":-40}],\"-\",\"-\",[\"Mount\",\"mount\",null,{\"pet-name\":\"brown horse\"}]]', 0, '2007-03-30', '-1'),
(1002, 52, 'Eleaddai-beforeInfiinteWo', 'eleaddai-before-infinite-world-work', 7, 25, '[{\"type\":20,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},{\"type\":17,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', '{\"0-0\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902271848\"},\"0-1\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902291002\"},\"0-2\":{\"type\":5,\"quantity\":9,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902334721\"},\"0-20\":{\"type\":63,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"type\":65,\"quantity\":4,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100}],\"hash\":\"3149991999902334723\"},\"0-21\":{\"type\":64,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991998902334721\"},\r\n\r\n\r\n\r\n\"0-22\":{\"type\":66,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"114894651998902334721\"},\r\n\"0-23\":{\"type\":68,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489465199890233453465321\"},\r\n\r\n\"0-18\":{\"type\":70,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1148946519989023367674721\"},\r\n\"0-19\":{\"type\":72,\"quantity\":6,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463453465321\"},\r\n\r\n\"1-12\":{\"type\":34,\"quantity\":2,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463dfggfd453465321\",\"contains\":3},\r\n\"1-13\":{\"type\":34,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"11489463dfggfd4534999965321\",\"contains\":-2},\r\n\r\n\"1-14\":{\"type\":81,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1148946345345567788653244432423321\",\"contains\":{\"ugc-id\":\"3\",\"ugc-title\":\"Eleaddai\'s Custom Card\"}},\r\n\r\n\"1-3\":{\"type\":80,\"quantity\":1,\"quality\":40,\"durability\":100,\"currentWear\":0,\"effectiveness\":50,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"114894634534653244432423321\",\"contains\":{\"ugc-id\":\"2\",\"ugc-title\":\"Titian\'s Venus\"}},\r\n\r\n\r\n\"0-3\":{\"type\":19,\"quantity\":12,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902358469\"},\"0-9\":{\"type\":12,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":1,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902379274\"},\"0-8\":{\"type\":12,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":6,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902396179\"},\"0-4\":{\"type\":9,\"quantity\":8,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902425351\"},\"0-5\":{\"type\":10,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902445101\"},\"0-6\":{\"type\":8,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":45,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902469179\"},\"0-7\":{\"type\":11,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902489049\"},\"p0-3\":{\"type\":55,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"A quest book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>You\'ve just started a new quest. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"},\"hash\":\"1149991538902537077\"},\"0-10\":{\"type\":33,\"quantity\":10,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902557653\"},\"0-12\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902588374\"},\"0-16\":{\"type\":40,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":5,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902609376\"},\"1-1\":{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902627456\"},\"1-2\":{\"type\":21,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902650113\"},\"1-4\":{\"type\":29,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902671831\"},\"1-5\":{\"type\":30,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902689349\"},\"1-6\":{\"type\":13,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902728964\"},\"0-11\":{\"type\":20,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902751592\"},\"1-7\":{\"type\":33,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"An old book\",\"timeCreated\":\"1489052663553\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ultricies ipsum, a faucibus neque. Duis rutrum, nunc ac mattis vestibulum, lorem odio facilisis lectus, vel finibus tellus libero non quam. Ut sodales aliquet mauris, sit amet suscipit ante vulputate a. Nulla sed ex tempus lacus rutrum egestas sit amet et eros. Ut sit amet metus tortor. Nulla tincidunt luctus commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<\\/p><p>Curabitur ut est vitae quam vehicula efficitur nec at orci. Vivamus semper lectus nisi, et vehicula eros imperdiet viverra. Donec imperdiet magna lectus, sed tempus libero dapibus et. Ut non viverra nulla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur turpis justo, vulputate a vehicula ut, pellentesque rutrum dolor. Proin et dolor dignissim, auctor purus vel, accumsan lorem. <\\/p><\\/section>\"},\"hash\":\"1149991538902773110\"},\"1-8\":{\"type\":31,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":[{\"type\":28,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":8,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}],\"hash\":\"1149991538902817652\"},\"1-9\":{\"type\":32,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":{\"title\":\"Another old book\",\"timeCreated\":\"1489052678002\",\"content\":\"<section><h1>Chapter 1<\\/h1><p>\'Wow! wow! wow!\' While the Owl had the door of which was the Hatter.<\\/p><p> \'You ought to eat or drink under the window, she suddenly spread out her hand on the floor, and a bright brass plate with the dream of Wonderland of long ago: and how she would keep, through all her wonderful Adventures, till she got to do,\' said the Pigeon in a natural way again.<\\/p><p> That\'s all.\' \'In that direction,\' the Cat.<\\/p><\\/section><section><h1>Chapter 2<\\/h1><p>\'Off with her friend.<\\/p><p> When she got to go and get ready to sink into the book her sister sat still just as well as if she were looking over their slates; \'but it sounds uncommon nonsense.\' Alice didn\'t think that there was nothing so very tired of this.<\\/p><p> I think it was,\' the March Hare said\\u2014\' \'I didn\'t!\' the March Hare and the beak\\u2014 Pray how did you call it purring, not growling,\' said Alice.<\\/p><\\/section>\"},\"hash\":\"1149991538902847955\"},\"1-18\":{\"type\":53,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902888722\",\"additional\":\"2|4|4\",\"cooldown\":500,\"cooldownTimer\":0},\"1-19\":{\"type\":32,\"quantity\":5,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":16,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902907868\"},\"1-10\":{\"type\":41,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902922109\"},\"0-17\":{\"type\":5,\"quantity\":1,\"quality\":8,\"durability\":45,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902937865\"},\"0-15\":{\"type\":5,\"quantity\":9,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":4,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"hash\":\"1149991538902957225\"}}', '[3,7]', 3, '[0,1]', '[]', '[0,1,2,3,10,11,7,6,12,13,8,14]', '{\"hash\":\"\",\"type\":\"\",\"quickHoldIndex\":0}', '[]', '[\"67-74\"]', 35784, '[6,5,4,4,4,-2,4,4,4,4,4,4,4,4,4]', '[2,5]', 2, '{\"cardGamesWon\":2,\"cardGamesLost\":4,\"cardGamesDrawn\":0,\"numberOfcardsFlipped\":8,\"retinueMissionsCompleted\":0,\"retinueExplorationMissionsCompleted\":5,\"itemsCrafted\":0,\"itemsGathered\":0}', '{\"soundVolume\":\"1\",\"musicVolume\":\"0.6\"}', '{\"range\":4950,\"speed\":4}', '[]', '[{\"name\":\"White Hen\",\"src\":\"white-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":28,\"spriteHeight\":34,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":26,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1272,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[[26,26],[26,27],[26,28],[26,27],[26,26],[26,25],[26,24],[26,23],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22],[26,22]],\"drawnFacing\":\"n\",\"pathIndex\":1},{\"name\":\"Brown Hen\",\"src\":\"brown-hen.png\",\"width\":20,\"length\":20,\"spriteWidth\":28,\"spriteHeight\":34,\"centreX\":19,\"centreY\":28,\"tileX\":26,\"tileY\":28,\"facing\":\"n\",\"speed\":4,\"inventorySize\":6,\"animation\":{\"walk\":{\"length\":1,\"n\":0,\"e\":1,\"s\":2,\"w\":3}},\"state\":\"wait\",\"x\":1272,\"y\":1368,\"z\":0,\"dx\":0,\"dy\":0,\"foundPath\":\"\",\"breadcrumb\":[[26,28],[26,29],[26,30],[26,29],[26,28],[26,27],[26,26],[26,25],[26,24],[26,23],[26,23],[26,23],[26,23],[26,23],[26,23],[26,23]],\"drawnFacing\":\"n\",\"pathIndex\":1}]', '{\"money\":3412510,\"cardDust\":49,\"keys\":[]}', '[]', 20, '[\"-3,2\",\"-2,1\",\"-2,2\",\"-1,1\",\"-3,1\",\"-2,3\",\"-3,0\",\"-1,3\",\"-1,2\"]', '[]', '[]', '[[\"Harmful extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-40}],[\"Gentle extraction\",\"gather\",1,{\"time\":1500,\"purity\":10,\"quality\":-50}],\"-\",[\"Cross pollinate plants\",\"plant-breeding\",null,[]],[\"Dowse for metals\",\"dowse\",4,{\"range\":30}],[\"Survey for metals\",\"survey\",4,{\"time\":-500}],[\"Mineral extraction\",\"gather\",4,{\"time\":1500,\"purity\":10,\"quality\":-40}],\"-\",\"-\",[\"Mount\",\"mount\",null,{\"pet-name\":\"brown horse\"}]]', 0, '2007-03-30', '-1');

-- --------------------------------------------------------

--
-- Table structure for table `tblcollectionquests`
--

CREATE TABLE `tblcollectionquests` (
  `collectionQuestID` int(11) NOT NULL,
  `collectionQuestName` varchar(128) NOT NULL,
  `cleanurl` varchar(128) NOT NULL,
  `collectionQuestLore` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcollectionquests`
--

INSERT INTO `tblcollectionquests` (`collectionQuestID`, `collectionQuestName`, `cleanurl`, `collectionQuestLore`) VALUES
(0, 'The Barrow Mines', 'the-barrow-mines', 'Thus they complained that he dwelt northmost of all a civil strife against rebels and anarchists within. In the earlier travellers; it is nothing to show that even there our discovery had ended, and that the siege must be connected with the sun and moon revolve, making day and saved the ship\'s boat of Captain Gifford, and with Flanders, \"while for the explorations made and to dress our need\". '),
(1, 'The Anvil Plains', 'the-anvil-plains', 'After two years went by, King John and Philippa, in detail; the history of institutions there are two chief lords which have been profoundly different. For after all in Europe, of North Africa, of the world, where is so large, as it were Catholic mythology turned inside out and hung down even to Quito in Peru.');

-- --------------------------------------------------------

--
-- Table structure for table `tblcolours`
--

CREATE TABLE `tblcolours` (
  `colourID` int(11) NOT NULL,
  `colourName` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(17, 'Ruby'),
(18, 'Amber'),
(19, 'Sienna'),
(20, 'Sapphire'),
(21, 'Indigo'),
(22, '(dark green/emerald/olive)'),
(23, '(dark brown/chestnut)'),
(24, 'Grey');

-- --------------------------------------------------------

--
-- Table structure for table `tblcontractbids`
--

CREATE TABLE `tblcontractbids` (
  `bidID` int(255) NOT NULL,
  `contractID` int(255) NOT NULL,
  `characterID` int(255) NOT NULL,
  `bidAmount` int(255) NOT NULL,
  `bidPlaced` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `tblcontracts` (
  `contractID` int(255) NOT NULL,
  `contractStart` datetime NOT NULL,
  `contractEnd` datetime NOT NULL,
  `characterID` int(255) NOT NULL,
  `itemID` int(255) NOT NULL,
  `quantity` int(255) NOT NULL,
  `contractType` int(1) NOT NULL,
  `startLocation` int(255) NOT NULL,
  `endLocation` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `tblcreatures` (
  `creatureID` int(11) NOT NULL,
  `creatureName` varchar(255) DEFAULT NULL,
  `creatureDescription` longtext,
  `creatureType` varchar(128) NOT NULL,
  `cleanURL` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblcreatures`
--

INSERT INTO `tblcreatures` (`creatureID`, `creatureName`, `creatureDescription`, `creatureType`, `cleanURL`) VALUES
(0, 'Pilcrow', 'A black bird with a curious fascination for anything with writing on.', 'Bird', 'pilcrow'),
(1, 'Auroch', 'A surprisingly gentle herd animal given its enormous horns.', 'Animal', 'auroch'),
(2, 'Ellyll', 'The Ellyllon are delightful little fairy folk.', 'Spirit', 'ellyll'),
(3, 'Gobling', 'Anywhere underground, you\'re bound to find some of these.', 'Denizen', 'gobling'),
(4, 'Eldritch', 'A dark, mischievous spirit. Worth avoiding if possible.', 'Spirit', 'eldritch'),
(5, 'Ghast', 'A malevolent trapped soul.', 'Spirit', 'ghast'),
(6, 'Guise', 'A shape shifter. ', 'Animal', 'guise'),
(7, 'Dwarrow', 'Stocky types who love mining.', 'Denizen', 'dwarrow'),
(8, 'Eldra', 'The Eldra (also called The Huldra, Uldra or Huldra-folk in some regions) are ancient beings.', 'Denizen', 'eldra'),
(9, 'Spriggan', 'A real mischievous type.', 'Denizen', 'spriggan'),
(11, 'Inkling', 'No-one\'s quite sure...', 'Denizen', 'inkling'),
(12, 'Draugar', 'A reanimated being.', 'Spirit', 'draugar'),
(13, 'Gnohm', 'Delightful little folk.', 'Denizen', 'gnohm'),
(14, 'Hydratid', 'Aquatic creature.', 'Animal', 'hydratid'),
(15, 'Gnarlkin', 'A small tree-like sprite.', 'Spirit', 'gnarlkin'),
(16, 'Fomorrah', 'Nether giant.', 'Denizen', 'fomorrah'),
(17, 'Druine', 'Who knows quite what they are?', 'Spirit', 'druine'),
(18, 'Ambler', 'Huge, lumbering forest dweller.', 'Elemental', 'ambler'),
(19, 'Trow', 'A large humanoid creature.', 'Denizen', 'trow'),
(20, 'Grimlin', 'A small sprite.', 'Spirit', 'grimlin'),
(21, 'Murmour', 'A mischievous spirit.', 'Spirit', 'murmour'),
(22, 'Tartaruga', 'A tortoise-like creature.', 'Animal', 'tartaruga'),
(23, 'Turtoise', 'Amphibian creature.', 'Animal', 'turtoise'),
(24, 'Blighter', 'Cheeky little things.', 'Denizen', 'blighter');

-- --------------------------------------------------------

--
-- Table structure for table `tblcreaturetypes`
--

CREATE TABLE `tblcreaturetypes` (
  `creatureTypeId` int(11) NOT NULL,
  `creatureTypeName` varchar(255) DEFAULT NULL,
  `creatureTypeURL` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tbldungeonachievements` (
  `index` int(255) NOT NULL,
  `charId` int(255) NOT NULL,
  `dungeonId` int(255) NOT NULL,
  `mapReached` int(255) NOT NULL,
  `timeStamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `tbldungeonmapconfig` (
  `dungeonId` int(11) NOT NULL,
  `dungeonName` varchar(255) COLLATE utf8_bin NOT NULL,
  `cleanURL` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `tblevents` (
  `eventID` int(11) NOT NULL,
  `eventStart` date DEFAULT NULL,
  `eventDurationDays` int(11) NOT NULL,
  `repeatsAnnually` tinyint(1) DEFAULT '0',
  `title` varchar(255) DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `eventContent` longtext NOT NULL,
  `cleanURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblforums` (
  `forumID` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) NOT NULL,
  `description` mediumtext,
  `imagePath` varchar(255) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblforums`
--

INSERT INTO `tblforums` (`forumID`, `title`, `cleanURL`, `description`, `imagePath`, `status`, `sticky`) VALUES
(1, 'Bug Reports', 'bug-reports', 'Found a bug? Let us know about it here.', '/images/forum/bugforum.gif', '2', '1'),
(2, 'Suggestions', 'suggestions', 'Thought of an improvement? Let us know what features you\'d like to see in the next update.', '/images/forum/suggestforum.gif', '2', '1'),
(3, 'General Discussion', 'general-discussion', 'Want to meet other players? find and chat to them here.', '/images/forum/generalforum.gif', '2', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tblfreeformpages`
--

CREATE TABLE `tblfreeformpages` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblfreeformpages`
--

INSERT INTO `tblfreeformpages` (`pageID`, `status`, `pageContent`, `textColour`, `bgColour`, `freeformPageTitle`, `cleanURL`, `guildID`, `public`, `creationTime`, `fontfamily`) VALUES
(1, '1', '&lt;P&gt;stuff&lt;/P&gt;\n&lt;P&gt;more stuff&lt;/P&gt;\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'guild page #1', 'guild-page-1', 1, '1', '2006-07-23 00:00:00', 'Georgia, \'Times New Roman\', Times, serif'),
(2, '1', '&lt;P&gt;second stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'guild page #2', 'guild-page-2', 1, '1', '2006-07-23 00:00:00', 'Georgia, \'Times New Roman\', Times, serif'),
(3, '1', '&lt;P&gt;earthen stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;', 'CCCCCC', '330000', 'earthen page', 'earthen-page', 2, '1', '2006-07-23 00:00:00', 'Georgia, \'Times New Roman\', Times, serif');

-- --------------------------------------------------------

--
-- Table structure for table `tblfriendlist`
--

CREATE TABLE `tblfriendlist` (
  `friendlistID` int(11) NOT NULL,
  `characterID` int(11) DEFAULT NULL,
  `friendID` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblguildmembers` (
  `guildMemberID` int(11) NOT NULL,
  `guildID` int(11) DEFAULT NULL,
  `charID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblguilds` (
  `guildID` int(11) NOT NULL,
  `guildName` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `createdTime` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblinventoryitems` (
  `itemID` int(11) NOT NULL,
  `shortname` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `priceCode` varchar(12) DEFAULT NULL,
  `centreX` decimal(11,1) DEFAULT NULL,
  `centreY` decimal(11,1) DEFAULT NULL,
  `width` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `spriteWidth` int(11) DEFAULT NULL,
  `spriteHeight` int(11) DEFAULT NULL,
  `canBeRotated` tinyint(1) NOT NULL DEFAULT '0',
  `cleanURL` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `actionValue` longtext CHARACTER SET utf8mb4 NOT NULL,
  `dyeable` tinyint(1) NOT NULL,
  `holdable` tinyint(1) NOT NULL DEFAULT '0',
  `stackable` tinyint(1) NOT NULL DEFAULT '1',
  `level` int(11) NOT NULL,
  `prerequisites` varchar(255) NOT NULL,
  `itemGroup` varchar(32) NOT NULL,
  `itemCategories` varchar(128) DEFAULT NULL,
  `racialPreference` varchar(128) DEFAULT NULL,
  `inscribable` tinyint(1) NOT NULL,
  `colour` int(128) NOT NULL,
  `hasInherentColour` tinyint(1) NOT NULL DEFAULT '0',
  `showInTheCodex` tinyint(1) NOT NULL DEFAULT '1',
  `lockedToThisPlayer` tinyint(1) NOT NULL DEFAULT '0',
  `respawnRate` int(11) DEFAULT NULL,
  `activeDuringSeason` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblinventoryitems`
--

INSERT INTO `tblinventoryitems` (`itemID`, `shortname`, `description`, `priceCode`, `centreX`, `centreY`, `width`, `length`, `spriteWidth`, `spriteHeight`, `canBeRotated`, `cleanURL`, `action`, `actionValue`, `dyeable`, `holdable`, `stackable`, `level`, `prerequisites`, `itemGroup`, `itemCategories`, `racialPreference`, `inscribable`, `colour`, `hasInherentColour`, `showInTheCodex`, `lockedToThisPlayer`, `respawnRate`, `activeDuringSeason`) VALUES
(1, 'Wild Flax', 'Useful for making linens', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'wild-flax', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(2, 'Wild Madder', 'A flower used for its red pigment.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'wild-madder', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 1, 1, 1, 0, NULL, NULL),
(3, 'Safflower', 'A flower used for its yellow pigment.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'safflower', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 2, 1, 1, 0, NULL, NULL),
(5, 'Whortleberry', 'The berries are used for their blue colour.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'whortleberry', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 4, 1, 1, 0, NULL, NULL),
(6, 'Meadowsweet', 'Used to make black pigments.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'meadowsweet', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 16, 1, 1, 0, NULL, NULL),
(7, 'Archil', 'A purple dye.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'archil', '', '0', 1, 0, 1, 0, '0', 'dye', '2', NULL, 0, 5, 1, 1, 0, NULL, NULL),
(8, 'Copper Mordant', 'A standard mordant.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'copper-mordant', '', '0', 0, 0, 1, 0, '0', 'mrdt', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(9, 'Iron Mordant', 'A mordant for making darker dyes.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'iron-mordant', '', '0', 0, 0, 1, 0, '0', 'mrdt', '2', NULL, 0, 16, 1, 1, 0, NULL, NULL),
(10, 'Alum Mordant', 'A mordant used for brighter dyes.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'alum-mordant', '', '0', 0, 0, 1, 0, '0', 'mrdt', '2', NULL, 0, 8, 1, 1, 0, NULL, NULL),
(11, 'Small Glass Bottle', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'small-glass-bottle', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(12, 'Dye', 'A standard pigment dye.', '4', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'dye', '', '0', 1, 0, 1, 0, '0', 'dye', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(13, 'Dyer\'s Cauldron', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'dyers-cauldron', 'craft', '0', 0, 0, 1, 0, '0', '0', '2', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(14, 'Linen', 'A useful fabric.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'linen', '', '0', 1, 0, 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(15, 'Wool', 'Basic wool, unspun.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'wool', '', '0', 1, 0, 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(16, 'Woolen Yarn', 'Spun wool.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'woolen-yarn', '', '0', 1, 0, 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(17, 'Small Backpack', 'A 20 slot bag', '2', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'small-backpack', 'bag', '20', 1, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(18, 'Barrel', 'A large wooden barrel.', '2', '25.0', '31.0', 38, 38, NULL, NULL, 0, 'barrel', 'static', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(19, 'Pumpkin', 'A tasty pumpkin.', '1', '16.0', '18.0', 25, 23, NULL, NULL, 0, 'pumpkin', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, 2),
(20, 'Large Backpack', 'A 30 slot bag', '2', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'large-backpack', 'bag', '30', 1, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(21, 'Card Pack', '5 cards', '4', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'card-pack', 'booster', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(22, 'Standing Stone', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'standing-stone', 'questToggle', '2', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(23, 'Mugwort', 'Used to make green dyes', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'mugwort', '', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 6, 1, 1, 0, NULL, NULL),
(24, 'Rim Lichen', 'Used to make purple dyes', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'rim-lichen', '', '0', 0, 0, 1, 0, '0', '0', '7', NULL, 0, 5, 1, 1, 0, NULL, NULL),
(25, 'Spring water', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'spring-water', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(26, 'Wood Ash', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'wood-ash', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(27, 'Apple Wood', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'apple-wood', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(28, 'Lye', 'Used for bleaching', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'lye', '', '0', 0, 0, 1, 0, '0', 'dye', NULL, NULL, 0, 8, 1, 1, 0, NULL, NULL),
(29, 'Recipe', 'Learn how to make something', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'recipe', 'recipe', '', 0, 0, 1, 0, '0', 'scribe', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(30, 'Weaver\'s Loom', 'Tools for weaving and tailoring', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'weavers-loom', 'craft', '1', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(31, 'Wrapped gift', 'Double click to see what\'s inside. ##contains##', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'wrapped-gift', 'container', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(32, 'Book', '', '4', '12.0', '6.0', 20, 13, NULL, NULL, 0, 'book', 'book', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 0, NULL, NULL),
(33, 'Parchment', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'parchment', 'book', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 0, NULL, NULL),
(34, 'Totem Card', 'A totem card.', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'totem-card', 'card', '', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(35, 'Wild Flax Node', '', '4', '19.0', '39.0', 20, 20, 28, 45, 0, 'wild-flax-node', 'node', '0', 0, 0, 1, 0, '0', '0', '1', NULL, 0, 0, 0, 0, 0, 300, NULL),
(37, 'Copperas', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'copperas', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(38, 'Acacia Resin', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'acacia-resin', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(39, 'Iron Gall', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'iron-gall', '', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 16, 1, 1, 0, NULL, NULL),
(40, 'Ink', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'ink', '', '0', 1, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(41, 'Scribe\'s Quill', '', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'scribes-quill', 'inscribe', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(42, 'Inner Door Lever', '', '1', '35.0', '35.0', 33, 33, 56, 45, 0, 'inner-door-lever', 'toggleInnerDoor', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(43, 'Inner Door Key', '', '1', '10.0', '6.0', 12, 12, NULL, NULL, 0, 'inner-door-key', 'key', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(44, 'Ammonite', 'Fossilised mollusc', '1', '25.0', '31.0', 38, 38, NULL, NULL, 0, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(45, 'Echinoid', 'Fossilised sea urchin', '1', '25.0', '31.0', 38, 38, NULL, NULL, 0, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(46, 'Crinoid', 'Fossilised coral', '1', '25.0', '31.0', 38, 38, NULL, NULL, 0, 'collection-fossil', 'collection', 'the-barrow-mines', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(47, 'Butterfly plant', '', '4', '19.0', '39.0', 20, 20, NULL, NULL, 0, 'butterfly-plant', 'nest', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, 300, NULL),
(48, 'Chest', '', '1', '44.0', '44.0', 48, 48, NULL, NULL, 0, 'chest', 'chest', '6', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(49, 'Worsted Yarn', 'Thicker, spun wool.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'worsted-yarn', '', '0', 1, 0, 1, 0, '0', '0', '3', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(50, 'Mineral Node', '', '4', '20.0', '16.0', 38, 38, 34, 25, 0, 'mineral-node', 'node', '0', 0, 0, 1, 0, '0', '0', '4', NULL, 0, 0, 0, 0, 0, 300, NULL),
(51, 'Copper', 'A soft metal.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'copper', '', '0', 0, 0, 1, 0, '0', '0', '4', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(52, 'Iron', 'A harder metal.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'iron', '', '0', 0, 0, 1, 0, '0', '0', '4', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(53, 'Home stone', 'Return to your home location.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'home-stone', 'home', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(54, 'Wanted Poster', 'poster', '1', '25.0', '36.0', 52, 52, NULL, NULL, 0, 'wanted-poster', 'notice', '0', 0, 0, 1, 0, '0', '0', '', NULL, 0, 0, 0, 0, 0, NULL, NULL),
(55, 'Quest Book', '', '4', '12.0', '6.0', 20, 13, NULL, NULL, 0, 'quest-book', 'book,questSet', '?,9', 0, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 1, 0, 0, NULL, NULL),
(56, 'Simple Chair', '', '4', '32.0', '40.0', 38, 38, 44, 49, 1, 'simple-chair', 'sit', '0', 1, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 0, 1, 0, NULL, NULL),
(57, 'House Deed', '12 by 16 plot', '8000', '32.0', '40.0', 38, 38, NULL, NULL, 0, 'house-deed', 'deed', '12x16', 0, 0, 1, 0, '0', '0', '6', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(58, 'House Deed', '8 by 6 plot', '12000', '32.0', '40.0', 38, 38, NULL, NULL, 0, 'house-deed', 'deed', '8x6', 0, 0, 1, 0, '0', '0', '6', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(59, 'Post Box', 'For posting', '2', '45.0', '63.0', 38, 38, NULL, NULL, 0, 'post-box', 'post', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(60, 'Tellurite', 'A metal with special properties.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'tellurite', '', '0', 0, 0, 1, 0, '0', '0', '4', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(61, 'Barrel 2', 'A large wooden barrel.', '2', '25.0', '31.0', 38, 38, NULL, NULL, 0, 'barrel2', 'static', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(62, 'Well', 'A well', '20', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'well', 'source', '65', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(63, 'Bucket', 'A bucket', '4', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'bucket', 'holds-liquid', '6', 0, 1, 0, 0, '0', '0', NULL, NULL, 1, 0, 0, 1, 0, NULL, NULL),
(64, 'Hoe', 'A hoe', '4', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'hoe', 'till', '', 0, 1, 0, 0, '0', '0', NULL, NULL, 1, 0, 0, 1, 0, NULL, NULL),
(65, 'Water', 'water', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'water', '', '', 0, 0, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(66, 'Silkflower Seed', 'Seeds for a Silkflower', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'silkflower-seed', 'seed', '{\r\n\"type\":67,\r\n\"additional\":2,\r\n                 \"state\": \"1\",\r\n            \r\n            \r\n                \"animation\":\r\n                {\r\n                    \"1\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 0\r\n                    },\r\n                    \"2\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 1\r\n                    },\r\n                    \"3\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 2\r\n                    },\r\n                    \"4\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 3\r\n                    },\r\n                      \"5\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 4\r\n                    },\r\n                      \"6\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 5\r\n                    }\r\n                },\r\n                \"contains\": \r\n                {\"pollen\": {\r\n                    \"type\": 68,\r\n                    \"quantity\": 6\r\n                },\r\n                \r\n                \"fruit\": {\r\n                     \"type\": 69,\r\n                    \"quantity\": 1\r\n                }\r\n            }\r\n    }', 1, 1, 1, 0, '0', '0', '8', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(67, 'Silkflower Plant', 'Silkflower', '0', '40.0', '46.0', 48, 48, 79, 59, 0, 'silkflower-plant', 'crop', '66', 1, 1, 1, 0, '0', '0', '9', NULL, 0, 0, 0, 1, 0, 300, NULL),
(68, 'Silkflower Pollen', 'Silkflower pollen', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'silkflower-pollen', 'pollen', '67', 1, 1, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(70, 'Wispbell Seed', 'Seeds for a Wispbell ', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'wispbell-seed', 'seed', '\r\n{\r\n\"type\":71,\r\n\"additional\":2,\r\n                 \"state\": \"1\",\r\n            \r\n            \r\n                \"animation\":\r\n                {\r\n                    \"1\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 0\r\n                    },\r\n                    \"2\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 1\r\n                    },\r\n                    \"3\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 2\r\n                    },\r\n                    \"4\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 3\r\n                    },\r\n                      \"5\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 4\r\n                    },\r\n                      \"6\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 5\r\n                    }\r\n                },\r\n                \"contains\": \r\n                {\"pollen\": {\r\n                    \"type\": 72,\r\n                    \"quantity\": 6\r\n                }\r\n            }\r\n    }', 1, 1, 1, 0, '0', '0', '8', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(71, 'Wispbell Plant', 'Wispbell', '0', '40.0', '46.0', 48, 48, 79, 59, 0, 'wispbell-plant', 'crop', '70', 1, 1, 1, 0, '0', '0', '9', NULL, 0, 0, 0, 1, 0, 300, NULL),
(72, 'Wispbell Pollen', 'Wispbell pollen', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'wispbell-pollen', 'pollen', '71', 1, 1, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(73, 'Wildcrown Seed', 'Seeds for a Wildcrown', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'wildcrown-seed', 'seed', '\r\n{\r\n\"type\":74,\r\n\"additional\":2,\r\n                 \"state\": \"1\",\r\n            \r\n            \r\n                \"animation\":\r\n                {\r\n                    \"1\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 0\r\n                    },\r\n                    \"2\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 1\r\n                    },\r\n                    \"3\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 2\r\n                    },\r\n                    \"4\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 3\r\n                    },\r\n                      \"5\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 4\r\n                    },\r\n                      \"6\":\r\n                    {\r\n                        \"length\": 1,\r\n                        \"row\": 5\r\n                    }\r\n                },\r\n                \"contains\": \r\n                {\"pollen\": {\r\n                    \"type\": 75,\r\n                    \"quantity\": 6\r\n                }\r\n            }\r\n    }', 1, 1, 1, 0, '0', '0', '8', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(74, 'Wildcrown Plant', 'Wildcrown', '0', '40.0', '46.0', 48, 48, 79, 59, 0, 'wildcrown-plant', 'crop', '73', 1, 1, 1, 0, '0', '0', '9', NULL, 0, 0, 0, 1, 0, 300, NULL),
(75, 'Wildcrown Pollen', 'Wildcrown pollen', '0', '87.0', '92.0', 96, 96, NULL, NULL, 0, 'wildcrown-pollen', 'pollen', '74', 1, 1, 1, 0, '0', '0', NULL, NULL, 0, 0, 0, 1, 0, NULL, NULL),
(76, 'Fence NS', 'Fence NS', '0', '38.0', '38.0', 5, 96, NULL, NULL, 0, 'simple-fence-ns', '', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(77, 'Fence EW', 'Fence EW', '0', '38.0', '38.0', 96, 5, NULL, NULL, 0, 'simple-fence-ew', '', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(78, 'Gate NS', 'Gate NS', '0', '40.0', '38.0', 5, 96, 87, 63, 0, 'simple-gate-ns', 'gate', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(79, 'Gate EW', 'Gate EW', '0', '60.0', '38.0', 96, 5, 87, 63, 0, 'simple-gate-ew', 'gate', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(80, 'Picture Frame', 'Picture Frame', '20000', '17.0', '46.0', 5, 48, 31, 56, 0, 'picture-frame', '', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(81, 'Card Back', 'Card Back', '20000', '17.0', '46.0', 5, 48, 31, 56, 0, 'card-back', 'cardBack', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(82, 'Treasure Map', 'Treasure map', '20000', '17.0', '46.0', 5, 48, 31, 56, 0, 'treasure-map', 'treasureMap', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL),
(83, 'Hnefatafl Table', 'Hnefatafl Table.', '4', '33.0', '29.0', 38, 38, 54, 40, 0, 'hnefatafl-table', 'static', '0', 1, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 0, 1, 0, NULL, NULL),
(84, 'Catalogue Quest', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'catalogue-quest', 'catalogue', '', 0, 0, 0, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 1, NULL, NULL),
(85, 'Bog Iron', 'An unrefined harder metal.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'bog-iron', '', '0', 0, 0, 1, 0, '0', '0', '4', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(86, 'House Tool', 'Enables house construction and management', '1500', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'house-tool', 'house', '0', 0, 0, 0, 0, '0', '0', '6', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(88, 'House Wall - Stone - Full', '', '11000', '71.0', '100.0', 48, 48, 95, 114, 1, 'full-wall', 'static', '0', 0, 0, 1, 0, '0', 'housing-walls', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(96, 'House Wall - Stone - Full Window', '', '13000', '71.0', '100.0', 48, 48, 95, 114, 1, 'full-window', 'static', '0', 0, 0, 1, 0, '0', 'housing-walls', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(100, 'House Door', '', '43000', '71.0', '100.0', 48, 48, 95, 114, 0, 'door-e', 'static', '0', 0, 0, 1, 0, '0', 'housing-walls', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(101, 'Wood Floor', '', '2000', '24.0', '12.0', 48, 48, 48, 24, 0, 'wood-floor', 'static', '0', 0, 0, 1, 0, '0', 'housing-floors', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(103, 'House Wall - Stone - Corner', '', '13000', '71.0', '100.0', 48, 48, 95, 114, 1, 'full-corner', 'static', '0', 0, 0, 1, 0, '0', 'housing-walls', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(106, 'House Wall - Stone - Inner Post', '', '1500', '71.0', '100.0', 48, 48, 95, 114, 1, 'full-inner-post', 'static', '0', 0, 0, 1, 0, '0', 'housing-walls', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(109, 'Stone Floor', '', '2000', '24.0', '12.0', 48, 48, 48, 24, 0, 'stone-floor', 'static', '0', 0, 0, 1, 0, '0', 'housing-floors', '10', NULL, 0, 0, 0, 1, 0, NULL, NULL),
(110, 'Paper', '', '4', '49.0', '81.0', 63, 63, NULL, NULL, 0, 'paper', 'book', '0', 0, 0, 1, 0, '0', '0', NULL, NULL, 1, 0, 1, 1, 0, NULL, NULL),
(111, 'Small hawk egg', 'Hatches into a small hawk.', '1', '20.0', '24.0', 0, 0, NULL, NULL, 0, 'small-hawk-egg', 'pet', '', 1, 0, 1, 0, '0', '0', '11', NULL, 0, 0, 0, 1, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblitemcategories`
--

CREATE TABLE `tblitemcategories` (
  `categoryID` int(11) NOT NULL,
  `categoryName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblitemcategories`
--

INSERT INTO `tblitemcategories` (`categoryID`, `categoryName`) VALUES
(1, 'Flowers'),
(2, 'Dyer\'s Provisions'),
(3, 'Tailor\'s Provisions'),
(4, 'Metalworker\'s provisions'),
(5, 'Books'),
(6, 'House Deeds'),
(7, 'Herbs'),
(8, 'Seeds'),
(9, 'Breedable Plants\r\n'),
(10, 'Housing Tiles\r\n'),
(11, 'Pets\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `tblitemgroups`
--

CREATE TABLE `tblitemgroups` (
  `itemGroupID` int(11) NOT NULL,
  `itemGroupCode` varchar(255) DEFAULT NULL,
  `itemGroupDescription` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblitemgroups`
--

INSERT INTO `tblitemgroups` (`itemGroupID`, `itemGroupCode`, `itemGroupDescription`) VALUES
(0, '0', '0'),
(1, 'mrdt', 'Any Mordant'),
(2, 'dye', 'Any Dye'),
(3, 'scribe', 'Anything that a Scribe can copy'),
(4, 'enchant', 'Any item with raw magical properties'),
(5, 'housing-walls', 'Housing Tiles - Walls'),
(6, 'housing-floors', 'Housing Tiles - Floors');

-- --------------------------------------------------------

--
-- Table structure for table `tbllocations`
--

CREATE TABLE `tbllocations` (
  `locID` int(255) NOT NULL,
  `locName` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `tblmail` (
  `mailID` int(11) NOT NULL,
  `characterID` int(11) DEFAULT NULL,
  `senderID` int(11) DEFAULT NULL,
  `senderName` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `mailContents` mediumtext,
  `sentTime` datetime DEFAULT NULL,
  `mailRead` char(1) DEFAULT NULL,
  `opensQuest` int(4) NOT NULL DEFAULT '-1',
  `attachment` longtext,
  `attachmentTaken` tinyint(1) NOT NULL DEFAULT '0',
  `isArchived` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblmail`
--

INSERT INTO `tblmail` (`mailID`, `characterID`, `senderID`, `senderName`, `title`, `mailContents`, `sentTime`, `mailRead`, `opensQuest`, `attachment`, `attachmentTaken`, `isArchived`) VALUES
(81, 18, 5, 'Eleaddai', 'elli to newmemberchar1', 'c to c', '2006-08-02 22:10:06', '1', -1, '0', 0, 0),
(83, 999, 18, 'murphy', 'Re: eleaddai to newmemberchar1', 'hi - have 2 pumpkins!', '2018-02-02 22:13:05', '1', -1, ' [{\n\n                \"type\": 19,\n                                \"quantity\": 2,\n                \"quality\": 100,\n                \"durability\": 100,\n                \"currentWear\": 0,\n                \"effectiveness\": 100,\n                \"wrapped\": 0,\n                \"colour\": 0,\n                \"enchanted\": 0,\n                \"hallmark\": 0,\n                \"inscription\": \"\"\n\n            }]', 0, 0),
(84, 18, 5, 'Eleaddai', 'Re: Re: elli to newmemberchar1', '[quote=newmemberchar1][quote=Eleaddai]c to c[/quote] m[/quote]xc', '2006-08-02 22:13:30', '2', -1, '0', 0, 0),
(85, 14, 5, 'Alice', 'alice to moderator', 'c to a', '2006-08-02 22:14:08', '1', -1, '0', 0, 0),
(86, 5, 14, 'moderator', 'Re: alice to moderator', '[quote=Alice]c to a[/quote]x', '2006-08-02 22:14:24', '2', -1, '0', 0, 0),
(87, 14, 5, 'Alice', 'Re: Re: alice to moderator', '[quote=moderator][quote=Alice]c to a[/quote]x[/quote]xc', '2006-08-02 22:14:59', '2', -1, '0', 0, 0),
(88, 14, 5, 'seawarrior', 'seawarrior to moderator', 'a to a', '2006-08-02 22:15:22', '2', -1, '0', 0, 0),
(89, 5, 14, 'moderator', 'Re: seawarrior to moderator', '[quote=seawarrior]a to a[/quote] ta', '2006-08-02 22:15:39', '2', -1, '0', 0, 0),
(90, 14, 5, 'seawarrior', 'Re: Re: seawarrior to moderator', '[quote=moderator][quote=seawarrior]a to a[/quote] ta[/quote] cvc', '2006-08-02 22:15:56', '0', -1, '0', 0, 0),
(91, 18, 5, 'seawarrior', 'seawarrior to newmemberchar1', 'a to c', '2006-08-02 22:16:31', '2', -1, '0', 0, 0),
(92, 5, 18, 'newmemberchar1', 'Re: seawarrior to newmemberchar1', ' cheers', '2006-08-02 22:16:53', '1', -1, '0', 0, 0),
(93, 18, 5, 'seawarrior', 'Re: Re: seawarrior to newmemberchar1', '[quote=newmemberchar1] cheers[/quote] go', '2006-08-02 22:17:07', '2', -1, '0', 0, 0),
(94, 18, 14, 'modchar2', 'to newmem char2', 'dffd', '2006-08-03 14:08:45', '1', -1, '0', 0, 0),
(95, 14, 5, 'seawarrior', 'styled stuff', 'fgfgfg[link=dfdf]dfdf[/link]cxcxc[image=xcx]\r\n\r\n\r\nh[u]ap[/u]py ', '2006-08-06 21:44:37', '1', -1, '0', 0, 0),
(96, 5, 14, 'moderator', 'Re: styled stuff', '[quote=seawarrior]fgfgfg[link=dfdf]dfdf[/link]cxcxc[/quote][image=xcx]\r\n\r\n\r\nh[u]ap[/u]py  cheers boss :) [u]underline[/u][', '2006-08-06 21:46:52', '1', -1, '0', 0, 0),
(97, 14, 5, 'seawarrior', 'blibllw', 'sd[s]fdf[/s] this is a report test', '2006-08-13 15:57:15', '1', -1, '0', 0, 0),
(98, 14, 5, 'seawarrior', 'test atach', 'df', '2006-08-14 19:21:11', '0', -1, '0', 0, 0),
(99, 14, 5, 'seawarrior', 'test', 'dfdf', '2006-08-14 19:22:59', '0', -1, '0', 0, 0),
(100, 14, 5, 'seawarrior', 'test', 'dfdfdf', '2006-08-14 19:24:52', '0', -1, '0', 0, 0),
(101, 14, 5, 'seawarrior', 'spam', 's', '2006-08-14 19:26:28', '0', -1, '0', 0, 0),
(102, 14, 5, 'seawarrior', 'spam2', 'sdsd', '2006-08-14 19:27:02', '0', -1, '0', 0, 0),
(103, 14, 5, 'seawarrior', 'spam3', 'dsds', '2006-08-14 19:28:33', '0', -1, '0', 0, 0),
(104, 14, 5, 'seawarrior', 'spam4', 'dsds', '2006-08-14 19:29:59', '0', -1, '0', 0, 0),
(105, 14, 5, 'seawarrior', 'sfdff', 'dfdf', '2006-08-14 19:31:19', '0', -1, '0', 0, 0),
(106, 14, 5, 'seawarrior', 'guess what? spam', 'dsd', '2006-08-14 19:33:15', '0', -1, '0', 0, 0),
(107, 14, 5, 'seawarrior', 'stuff', 'sdsd', '2006-08-14 21:48:17', '0', -1, '0', 0, 0),
(108, 14, 5, 'seawarrior', 'test', 'test', '2006-08-17 13:02:52', '0', -1, '0', 0, 0),
(109, 14, 5, 'seawarrior', 'testing', 'fdlfkdk lfkskf', '2006-08-17 13:12:46', '0', -1, '0', 0, 0),
(110, 14, 5, 'Eleaddai', 'john', 'dddddd', '2006-08-17 13:27:41', '0', -1, '0', 0, 0),
(111, 5, 14, 'seawarrior', 'Re: blibllw', '[quote=seawarrior]sdfdf this is a report test[/quote]fdf', '2006-08-17 20:45:01', '1', -1, '0', 0, 0),
(112, 14, 5, 'seawarrior', 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghghh', '2006-08-17 20:46:00', '0', -1, '0', 0, 0),
(113, 14, 5, 'seawarrior', 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]dfdfdfdf', '2006-08-17 20:47:17', '0', -1, '0', 0, 0),
(114, 14, 18, 'newmemberchar2', 'Re: to newmem char2', '[quote=modchar2]dffd[/quote]\r\nklklk', '2006-08-17 20:48:22', '1', -1, '0', 0, 0),
(115, 14, 18, 'newmemberchar2', 'Re: to newmem char2', '[quote=modchar2]dffd[/quote]', '2006-08-17 21:03:09', '0', -1, '0', 0, 0),
(116, 14, 5, 'seawarrior', 'Re: Re: styled stuff', '[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghg', '2006-08-17 21:03:46', '0', -1, '0', 0, 0),
(117, 14, 5, 'seawarrior', 'howdo', 'dfdf', '2006-08-17 21:13:10', '0', -1, '0', 0, 0),
(118, 14, 5, 'seawarrior', 'ljlj', 'lkj', '2006-08-17 21:13:56', '0', -1, '0', 0, 0),
(119, 14, 5, 'seawarrior', 'lkj', 'lkj', '2006-08-17 21:15:54', '0', -1, '0', 0, 0),
(120, 14, 5, 'seawarrior', 'jkh', 'kjhkh', '2006-08-17 21:16:09', '0', -1, '0', 0, 0),
(121, 14, 5, 'seawarrior', '(untitled)', 'sd', '2006-08-17 21:23:42', '0', -1, '0', 0, 0),
(122, 14, 5, 'seawarrior', 'adding items :)', 'here you go: 3 scrolls', '2006-08-20 10:44:47', '1', -1, '0', 0, 0),
(123, 14, 5, 'seawarrior', 'teasing', 'asas', '2006-08-20 10:49:18', '0', -1, '0', 0, 0),
(124, 14, 5, 'seawarrior', 'adding then changoing', '3 scrolls then 1 leaf', '2006-08-20 10:49:53', '1', -1, '0', 0, 0),
(125, 13, 5, 'seawarrior', 'sending stuff', '1 mushroom coming at ya', '2006-08-20 11:15:20', '1', -1, '11', 0, 0),
(126, 14, 5, 'seawarrior', 'another shrooom', '', '2006-08-20 11:17:31', '1', -1, '0', 0, 0),
(127, 14, 5, 'seawarrior', 'removing 1 scroll', '1 scroll', '2006-08-20 11:28:46', '1', -1, '0', 0, 0),
(128, 14, 5, 'seawarrior', 'all my shrooms', 'sdds', '2006-08-20 11:31:21', '1', -1, '0', 0, 0),
(129, 14, 5, 'seawarrior', 'all 4 shrooms', 'sds', '2006-08-20 11:33:32', '1', -1, '0', 0, 0),
(130, 14, 5, 'seawarrior', '9 shrooms', 'sd', '2006-08-20 11:37:22', '1', -1, '11', 0, 0),
(131, 14, 5, 'seawarrior', 'sd', 'sdsd', '2006-08-20 20:29:10', '1', -1, '0', 0, 0),
(132, 14, 5, 'seawarrior', 'sds', 'sd', '2006-08-20 20:29:20', '1', -1, '0', 0, 0),
(133, 5, 14, 'moderator', 'df', 'df', '2006-08-20 20:32:20', '1', -1, '0', 0, 0),
(134, 14, 5, 'seawarrior', 'sd', 'asas', '2006-08-20 20:34:20', '1', -1, '0', 0, 0),
(135, 14, 5, 'seawarrior', 'df', 'dfsfd', '2006-08-20 20:37:45', '1', -1, '0', 0, 0),
(136, 5, 14, 'moderator', 'cheers', 'cv', '2006-08-20 20:40:23', '2', -1, '0', 0, 0),
(137, 14, 5, 'seawarrior', 'sddf', 'dfdf', '2006-08-20 20:41:35', '1', -1, '0', 0, 0),
(138, 14, 23, 'stanley', 'sddsd', 'sads', '2006-08-20 20:42:41', '2', -1, '2', 0, 0),
(139, 5, 23, 'stanley', 'stan to angel', '3 scrolls...', '2006-08-20 23:02:56', '1', -1, '0', 0, 0),
(140, 14, 23, 'stanley', 'modchar1 from stan', 'sdsds', '2006-08-21 18:55:28', '1', -1, '0', 0, 0),
(141, 14, 5, 'seawarrior', 'test attach', 'adding 2 scrolls', '2006-08-30 09:09:04', '1', -1, '0', 0, 0),
(142, 14, 5, 'seawarrior', '(untitled)', '', '2006-11-05 10:42:52', '0', -1, '2', 0, 0),
(143, 14, 5, 'seawarrior', '(untitled)', '', '2006-11-05 10:43:42', '0', -1, '11', 0, 0),
(144, 14, 5, 'Alice', '1 gold', '1 gold!!!', '2006-12-02 21:40:27', '0', -1, '0', 0, 0),
(145, 14, 5, 'Alice', '1 gold 27 s', '1g 27s', '2006-12-02 21:49:31', '0', -1, '28', 0, 0),
(146, 14, 5, 'seawarrior', '21 silver', '21 !!!!', '2006-12-02 22:04:04', '0', -1, '27', 0, 0),
(147, 14, 5, 'seawarrior', '21', '21 again', '2006-12-02 22:06:36', '0', -1, '27', 0, 0),
(148, 14, 5, 'seawarrior', '21 .. .again!', 'df', '2006-12-02 22:07:52', '0', -1, '27', 0, 0),
(149, 14, 5, 'seawarrior', '(untitled)', '', '2006-12-02 22:08:16', '0', -1, '27', 0, 0),
(150, 14, 5, 'seawarrior', 'guess what?', '(no message)', '2006-12-02 22:10:27', '0', -1, '27', 0, 0),
(151, 14, 5, 'seawarrior', 'sd', '(no message)', '2006-12-02 22:11:12', '0', -1, '27', 0, 0),
(152, 14, 5, 'Alice', 'got to be 21 now', '(no message)', '2006-12-02 22:14:27', '0', -1, '27', 0, 0),
(153, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:18:16', '0', -1, '27', 0, 0),
(154, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:18:47', '0', -1, '27', 0, 0),
(155, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:20:48', '0', -1, '27', 0, 0),
(156, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:21:11', '0', -1, '27', 0, 0),
(157, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:22:27', '0', -1, '27', 0, 0),
(158, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:23:04', '0', -1, '27', 0, 0),
(159, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:23:28', '0', -1, '28', 0, 0),
(160, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:24:25', '0', -1, '28', 0, 0),
(161, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:24:38', '0', -1, '28', 0, 0),
(162, 14, 5, 'seawarrior', '(untitled)', '(no message)', '2006-12-02 22:25:03', '0', -1, '27', 0, 0),
(163, 23, 5, 'seawarrior', '(untitled)sd', '(no message)sd', '2006-12-18 22:27:09', '0', -1, '28', 0, 0),
(164, 23, 5, 'seawarrior', 'hiya', 'fgfg', '2006-12-18 22:31:55', '0', -1, '27', 0, 0),
(165, 23, 5, 'seawarrior', '18', 'eighteen coming across!', '2006-12-18 22:33:29', '0', -1, '27', 0, 0),
(166, 23, 5, 'Angel', 'ten', 'fg ddf', '2006-12-18 22:46:19', '0', -1, '27', 0, 0),
(167, 23, 5, 'Angel', 'seven', 'cvc', '2006-12-18 22:48:39', '0', -1, '27', 0, 0),
(168, 23, 5, 'Angel', 'test', 'xc', '2006-12-18 22:49:30', '0', -1, '27', 0, 0),
(169, 23, 5, 'Angel', 'ninteen', 'fd', '2006-12-18 22:50:20', '0', -1, '27', 0, 0),
(170, 23, 5, 'Angel', 'sdsd', 'sd', '2006-12-18 22:51:09', '0', -1, '27', 0, 0),
(171, 23, 5, 'Angel', '78', 'ghgh', '2006-12-18 22:53:01', '0', -1, '27', 0, 0),
(172, 23, 5, 'Angel', 'fdfdf', '(no message)', '2006-12-18 22:57:28', '0', -1, '27', 0, 0),
(173, 999, 5, 'Angel', 'hi', '(no message)', '2017-12-18 22:58:29', '1', -1, NULL, 0, 0),
(174, 23, 5, 'Angel', 'jkiol', 'gfg gddf ', '2006-12-18 22:59:53', '0', -1, '27', 0, 0),
(175, 23, 5, 'seawarrior', 'more', '(no message)', '2006-12-18 23:00:23', '0', -1, '28', 0, 0),
(176, 999, 5, 'seawarrior', 'testing refresh', 'testing! :) ', '2018-02-12 11:45:00', '1', -1, '0', 0, 0),
(177, 13, 5, 'seawarrior', 'refresh test 2', 'dsd', '2007-01-08 20:17:46', '1', -1, '0', 0, 0),
(178, 999, 5, 'seawarrior', 'another test', 'sdsd aa', '2018-02-11 00:00:00', '1', -1, '0', 0, 0),
(179, 5, 13, 'administrator', 'Re: refresh test 2', '[quote=seawarrior]dsd[/quote]cheers matey', '2007-01-10 22:50:47', '1', -1, '0', 0, 0),
(180, 5, 13, 'administrator', 'Re: another test', '[quote=seawarrior]sdsd aa[/quote]nice one', '2007-01-10 22:51:18', '0', -1, '0', 0, 0),
(181, 13, 5, 'seawarrior', 'Re: Re: refresh test 2', 'thanks', '2007-01-10 22:54:13', '0', -1, '0', 0, 0),
(182, 49, 49, 'dilly21', 'hi dilly', 'hi - how are you?', '2015-07-03 14:04:44', '0', -1, '0', 0, 0),
(183, 49, 48, 'dilly20', 'dilly21', 'hi 21 - this is 20', '2015-07-03 14:05:11', '1', -1, '0', 0, 0),
(914, 999, -1, 'Lars the mordant fan', 'Pass the mordant', 'thanks for giving me that mordant, here\'s some Card Pack.', '2018-02-14 12:07:15', '1', -1, '[{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(915, 999, -1, 'Lars the mordant fan', 'Pass the mordant', 'thanks for giving me that mordant, here\'s some Wild Madder.', '2018-02-14 12:07:45', '1', -1, '[{\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"1\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(916, 999, -1, 'Lars the mordant fan', 'Pass the mordant', 'thanks for giving me that mordant, here\'s some Card Pack.', '2018-02-14 12:46:12', '1', -1, '[{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(917, 999, -1, 'Lars the mordant fan', 'Pass the mordant', 'thanks for giving me that mordant, here\'s some Wild Madder.', '2018-02-14 16:25:00', '1', -1, '[{\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"1\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(918, 999, -1, 'labourer3', 'collection-quest collection', 'Fantastic, you got them all', '2018-02-14 16:53:40', '1', -1, '\n                \n                \n                [{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}, {\n                    \"type\": \"$\",\n                    \"quantity\": 3000\n                }]', 0, 0),
(919, 999, -1, 'labourer3', 'the barrow mines collection', 'Fantastic, you got them all', '2018-02-15 08:34:09', '1', -1, '[{\"type\":21,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}, {\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"1\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(927, 999, 999, 'Eleaddai', 'just to give you this', '`Curiouser and curiouser!\' cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); `now I\'m opening out like the largest telescope that ever was! Good-bye, feet!\' (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). `Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I\'m sure I shan\'t be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can; --but I must be kind to them,\' thought Alice, `or perhaps they won\'t walk the way I want to go! Let me see: I\'ll give them a new pair of boots every Christmas.\' ', '2018-02-15 12:40:38', '1', -1, '0', 0, 0),
(928, 1, 999, 'Eleaddai', 'hi', 'dsf sdfsd', '2018-02-15 14:36:36', '0', -1, '0', 0, 0),
(929, 2, 999, 'Eleaddai', 'eer', ' sfsf', '2018-02-15 14:37:25', '0', -1, '0', 0, 0),
(930, 999, 999, 'Eleaddai', 'hi from me', 'hi', '2018-02-15 14:38:24', '1', -1, '0', 0, 0),
(931, 999, 999, 'Eleaddai', 'have a lovely weekend', 'Take a spoonful of it given at a time, and then the Opobalsamum, then the chamber being kept safe from putrefaction.', '2018-02-16 16:23:48', '0', -1, '0', 0, 0),
(932, 999, 999, 'Eleaddai', 'have a lovely weekend', 'They say it purges hot rheums, and provokes urine and the white of an opening quality, thereby carrying away those vapours which might otherwise annoy the brain and nerves, and helps the falling-sickness, astonishment, apoplexies, dulness of sight, want of it to the consumption of the spleen, it stops fluxes, the running of the body, especially such as have laboured under long chronical diseases.', '2018-02-16 16:23:55', '0', -1, '0', 0, 0),
(933, 999, 999, 'Eleaddai', 'have a lovely weekend', 'They purge gross and putrified humours, and sets the senses oppressed by cold, it remedies cold infirmities of the fresh flowers and leaves, and Wormwood, of each six drams, Indian Spikenard, Schenanth, Pepper white and red, Spodium, Rhubarb, of each one dram, Lapis Hematilis, the wool of a Hare toasted, of each half an ounce, Galbanum, Opopanax, and Galbanum be put in the head.', '2018-02-16 16:24:01', '1', -1, '0', 0, 0),
(934, 999, 999, 'Eleaddai', 'have a lovely weekend', 'An ounce at a time, at night going to bed; if that provoke not sleep, the next day boil it to the consumption of the roots of Smallage, Fennel, and Sparagus, of each two drams, Gum Arabic, Dragonâ€™s-blood of each one ounce, Canary Wine a whole summerâ€™s day to write more scholastically, the dose) must be consumed and with a Liquorice stick, if you cannot but know both what Vinegar to the heart, and weak stomachs, and helps all diseases coming of cold and moisture.', '2018-02-16 16:24:07', '1', -1, '0', 0, 0),
(935, 999, 999, 'Eleaddai', 'have a lovely weekend', 'They say it purges hot rheums, and provokes urine and the white of an opening quality, thereby carrying away those vapours which might otherwise annoy the brain and nerves, and helps the falling-sickness, astonishment, apoplexies, dulness of sight, want of it to the consumption of the spleen, it stops fluxes, the running of the body, especially such as have laboured under long chronical diseases.An ounce at a time, at night going to bed; if that provoke not sleep, the next day boil it to the consumption of the roots of Smallage, Fennel, and Sparagus, of each two drams, Gum Arabic, Dragonâ€™s-blood of each one ounce, Canary Wine a whole summerâ€™s day to write more scholastically, the dose) must be consumed and with a Liquorice stick, if you cannot but know both what Vinegar to the heart, and weak stomachs, and helps all diseases coming of cold and moisture.', '2018-02-16 16:26:45', '1', -1, '0', 0, 0),
(936, 999, 999, 'Eleaddai', 'subject', 'dfsf\\n\\ndsf\\n\\n\\ndsf', '2018-02-16 16:31:15', '1', -1, '0', 0, 0),
(937, 999, 999, 'Eleaddai', 'asdad', 'asdadasd aadasa aa', '2018-02-16 16:32:33', '1', -1, '0', 0, 0),
(938, 999, 999, 'Eleaddai', 'just testing some line breaks', '\\nsecond line\\n\\n\\n\\n\\n\\nmore\\n\\n\\nmore\\n\\nand some  here', '2018-02-16 16:58:39', '1', -1, '0', 0, 0),
(939, 999, -1, 'Retinue co-ordinator', 'Reward for Lay of the Land on island', 'Your followers continue to make you proud...', '2018-02-22 12:28:50', '1', -1, '[{\"type\":80,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\",\"contains\":{\"ugc-id\":\"2\",\"ugc-title\":\"Titian\'s Venus\"}}]', 0, 0),
(950, 999, -1, 'Artisan crafter', 'Your crafted Sapphire Dye', 'This is fine work', '2018-03-29 13:22:59', '0', -1, '[{\"type\":34,\"quantity\":1,\"quality\":37,\"durability\":100,\"effectiveness\":100,\"currentWear\":0,\"wrapped\":0,\"colour\":20,\"enchanted\":0,\"hallmark\":-999,\"inscription\":\"\",\"contains\":-2}]', 0, 0),
(951, 999, -1, 'Lars the mordant fan', 'Pass the mordant', 'thanks for giving me that mordant, here\'s some Whortleberry.', '2019-02-01 12:52:48', '1', -1, '[{\"type\":5,\"quantity\":6,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"},{\"type\":29,\"contains\":\"6\",\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":0,\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', 0, 0),
(952, 999, -1, 'Quest giver', 'Start a quest', 'Opens a new quest', '2019-02-02 12:52:48', '1', 2, '0', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblmainpoll`
--

CREATE TABLE `tblmainpoll` (
  `pollID` int(11) NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `isCurrent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblmainpollchoices` (
  `choiceID` int(11) NOT NULL,
  `pollID` int(11) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `voteCount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblmainpollchoices`
--

INSERT INTO `tblmainpollchoices` (`choiceID`, `pollID`, `response`, `voteCount`) VALUES
(1, 1, 'yes', 3),
(2, 1, 'no', 4),
(3, 1, 'don\'t know', 9);

-- --------------------------------------------------------

--
-- Table structure for table `tblnews`
--

CREATE TABLE `tblnews` (
  `newsID` int(11) NOT NULL,
  `newsTitle` varchar(255) DEFAULT NULL,
  `cleanURL` varchar(255) DEFAULT NULL,
  `newsSynopsis` varchar(255) DEFAULT NULL,
  `newsContent` longtext,
  `bannerContent` varchar(255) NOT NULL,
  `status` char(1) DEFAULT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postedBy` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblnews`
--

INSERT INTO `tblnews` (`newsID`, `newsTitle`, `cleanURL`, `newsSynopsis`, `newsContent`, `bannerContent`, `status`, `timeAdded`, `postedBy`) VALUES
(1, 'Spring is on its way', 'spring-is-on-its-way', 'Face towards the rising sun and travel eastwards', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2015-07-09 10:19:41', NULL),
(2, 'New Year spectacular', 'new-year-spectacular', 'Fireworks and plenty of festive cheer', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2009-07-09 10:19:48', 'The Mayor'),
(3, 'more seasonal joy', 'more-seasonal-joy', 'brace yourselves!', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>', '', '1', '2015-07-09 10:19:54', NULL),
(4, 'April Fools has been and gone', 'april-fools-has-been-and-gone', 'well, we missed that one...', 'april fools has been &quot;and&quot; gone again &raquo; arrow', '', '1', '2015-07-22 12:45:53', NULL),
(5, 'Dragon flare', 'dragon-flare', 'Look up - in the sky', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque iaculis non elit a tempor. Nam commodo metus eget libero faucibus euismod. Vivamus interdum porta ante non finibus. Nam velit nisi, consectetur et tempor vitae, varius eu tortor. Duis ac eleifend libero, eu sagittis purus. Dragon nunc aliquam ut sapien sit amet molestie. Etiam pellentesque tristique vestibulum. Maecenas lacinia, arcu eu hendrerit eleifend, purus nulla ornare turpis, et bibendum sapien lectus non nulla. Ut facilisis lobortis nisi, id faucibus dolor molestie vel. Aliquam a mi at ligula accumsan pellentesque. Etiam pulvinar mauris ac justo semper efficitur. Ut lobortis egestas laoreet. Curabitur dui ex, placerat id nisl quis, malesuada consectetur lectus. Duis tincidunt congue commodo. In hac habitasse platea dictumst. ', '', '1', '2015-08-12 12:45:53', NULL),
(6, 'Down the rabbit hole', 'down-the-rabbit-hole', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\n<h3>And then</h3>\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\n<h3>After that</h3>\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-02 08:23:36', NULL),
(7, 'article 7', 'article-7', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-03 08:23:36', NULL),
(8, 'article 8', 'article-8', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-04 08:23:36', NULL),
(9, 'article 9', 'article-9', 'Spring rising and the end of winter dawns. Time to celebrate and join the festivities.', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-06 08:24:36', NULL),
(10, 'article 10', 'article-10', 'here\'s something', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-05 12:59:34', NULL);
INSERT INTO `tblnews` (`newsID`, `newsTitle`, `cleanURL`, `newsSynopsis`, `newsContent`, `bannerContent`, `status`, `timeAdded`, `postedBy`) VALUES
(11, 'article 11', 'article-11', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-07 08:23:36', NULL),
(12, 'article 12', 'article-12', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-08 08:23:36', NULL),
(13, 'article 13', 'article-13', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-10 08:23:36', NULL),
(14, 'article 14', 'article-14', 'Down, down', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-08 08:23:36', NULL),
(15, 'article 15', 'article-15', 'Donec vulputate, ipsum eu scelerisque scelerisque, massa risus molestie erat, a commodo urna sapien quis turpis. Quisque sit amet mattis arcu, et sodales sem. Aenean dictum neque semper, placerat mi ultricies, consequat orci. ', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', '', '1', '2016-03-14 17:29:37', NULL),
(16, 'article 16', 'article-16', 'Here\'s some news', '<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, &#8220;and what is the use of a book,&#8221; thought Alice &#8220;without pictures or conversation?&#8221;</p>\r\n<p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of <a href=\"#\">making a daisy-chain</a> would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>\r\n<p>There was nothing so <em>very</em> remarkable in that; nor did Alice think it so <em>very</em> much out of the way to hear the Rabbit say to itself, &#8220;Oh dear! Oh dear! I shall be late!&#8221; (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually <em>took a watch out of its waistcoat-pocket</em>, and looked at it, and then hurried on, Alice started to her feet, for <a href=\"#\">it flashed across her</a> mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>\r\n<p>In another moment down went Alice after it, never once considering how in the world she was to get out again.</p>\r\n<h3>And then</h3>\r\n<p>The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>\r\n<p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled &#8220;<a href=\"#\">ORANGE MARMALADE</a>&#8220;, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>\r\n<p>&#8220;Well!&#8221; thought Alice to herself, &#8220;after such a fall as this, I shall think nothing of tumbling down stairs! How brave they&#8217;ll all think me at home! Why, I wouldn&#8217;t say anything about it, even if I fell off the top of the house!&#8221; (Which was very likely true.)</p>\r\n<p>Down, down, down. Would the fall <em>never</em> come to an end! &#8220;I wonder how many miles I&#8217;ve fallen by this time?&#8221; she said aloud. &#8220;I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think &ndash; &#8221; (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a <em>very</em> good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) &#8221; &ndash; yes, that&#8217;s about the right distance &ndash; but then I wonder what Latitude or Longitude I&#8217;ve got to?&#8221; (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)</p>\r\n<h3>After that</h3>\r\n<p>Presently she began again. &#8220;I wonder if I shall fall right <em>through</em> the earth! How funny it&#8221;ll seem to come out among the people that walk with their heads downward! The Antipathies, I think &ndash; &#8221; (she was rather glad there <em>was</em> no one listening, this time, as it didn&#8217;t sound at all the right word) &#8221; &ndash; but I shall have to ask them what the name of the country is, you know. Please, Ma&#8217;am, is this New Zealand or Australia?&#8221; (and she tried to curtsey as she spoke &ndash; fancy <em>curtseying</em> as you&#8221;re falling through the air! Do you think you could manage it?) &#8220;And what an <a href=\"#\">ignorant little girl</a> she&#8221;ll think me for asking! No, it&#8217;ll never do to ask: perhaps I shall see it written up somewhere.&#8221;</p>\r\n<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. &#8220;Dinah&#8217;ll miss me very much to-night, I should think!&#8221; (Dinah was the cat.) &#8220;I hope they&#8217;ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I&#8217;m afraid, but you might catch a bat, and that&#8217;s very like a mouse, you know. But do cats eat bats, I wonder?&#8221; And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, &#8220;Do cats eat bats? Do cats eat bats?&#8221; and sometimes, &#8220;Do bats eat cats?&#8221; for, you see, as she couldn&#8217;t answer either question, it didn&#8217;t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, &#8220;Now, Dinah, tell me the truth: did you ever eat a bat?&#8221; when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>\r\n<p>Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, &#8220;Oh my ears and whiskers, how late it&#8217;s getting!&#8221; She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.</p>\r\n<p>There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.</p>\r\n<p>Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice&#8217;s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!</p>', 'placeholder.jpg', '1', '2016-03-30 08:57:00', 'The Mayor');

-- --------------------------------------------------------

--
-- Table structure for table `tblpantheon`
--

CREATE TABLE `tblpantheon` (
  `godID` int(11) NOT NULL,
  `godName` varchar(128) NOT NULL,
  `godGender` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblpantheon`
--

INSERT INTO `tblpantheon` (`godID`, `godName`, `godGender`) VALUES
(0, 'Thor', 'Male'),
(1, 'Freyja', 'Female');

-- --------------------------------------------------------

--
-- Table structure for table `tblplants`
--

CREATE TABLE `tblplants` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblplants`
--

INSERT INTO `tblplants` (`plantID`, `latinName`, `commonNames`, `plantDesc`, `plantUrl`, `tweetedContent`, `isAquatic`, `isNight`, `timeCreated`, `plantSeed`, `commonNamesJoined`) VALUES
(583, 'Brassium charida', 'Also known as Tannersarrow', '<p>This hath many green stalks, two or three feet high, rising from a tough, long, white root, which dies not every year, set round about at the joints with small and somewhat long, well-smelling leaves, set three together, unevently dented about the edges. The flowers are purple, and well-smelling also, made like other trefoil, but small, standing in long spikes one above another, for an hand breadth long or better, which afterwards turn into long crooked pods, wherein is contained flat seed, somewhat brown.</p><p>It grows in bogs and moorish places, and also on dry shady places, as Hampstead Heath, and elsewhere.</p><p></p><p>It flowers and seeds in February, March, and May.</p><p>This is also under the dominion of Freyja. It strengthens the stomach and head much, there being scarce a better remedy growing for such as are troubled with a sour humour in the stomach; it restores the appetite being lost; helps the cough, and consumption of the lungs; it cleanses the body of choler, expels poison, and remedies the infirmities of the spleen; helps the bitings of venomous beasts, and helps such as have poisoned themselves by eating Hemlock, Henbane, or Opium. It provokes urine and the terms in women, helps the dropsy, and the scurvy, scabs, itch, and yellow jaundice. The juice being dropped into the ears, helps deafness, pain and noise in the ears. And thus much for this herb, between which and adders, there is a deadly antipathy.</p>', 'brassium-charida', 'Brassium charida\r\nAlso known as Tannersarrow', 0, 0, '2019-09-04 00:00:00', 1568201237, 'Tannersarrow'),
(584, 'Solanum mygdalis', 'Greater adderwort', '<p>These are of two kinds; The first rises up with a round stalk about two feet high, spreads into divers branches, whose lower leaves are somewhat larger than the upper, yet all of them cut or torn on the edges, somewhat like the garden Cresses, but smaller, the flowers are small and white, growing at the tops of branches, where afterwards grow husks with small brownish seeds therein very strong and sharp in taste, more than the Cresses of the garden; the root is long, white, and woody. The other has the lower leaves whole somewhat long and broad, not torn at all, but only somewhat deeply dented about the edges towards the ends; but those that grow up higher are smaller. The flowers and seeds are like the former, and so is the root likewise, and both root and seeds as sharp as it.</p><p>It grows frequently in moist and shadowy woods, and in the lower parts of the fields and meadows.</p><p></p><p>It abides green all the Autumn, and seeds in March.</p><p>The plant is venereal, and breeds seed exceedingly, and strengthens the spirit procreative; it is hot and moist, and under the celestial Balance. The decoction of the root hereof in wine, is very effectual to open obstructions of the spleen and liver, and helps yellow jaundice, dropsy, pains of the loins, and wind cholic, provokes urine, and expels the stone, procures women&rsquo;s courses. The continued use of the decoction for fifteen days, taken fasting, and next to bedward, doth help the stranguary, the difficulty and stoppage of urine, and the stone, as well as all defects of the reins and kidneys; and if the said drink be continued longer, it is said that it cures the stone; it is found good against the French pox. The roots bruised and applied outwardly, help the kernels of the throat, commonly called the king&rsquo;s evil; or taking inwardly, and applied to the place stung or bitten by any serpent, heal it speedily. If the roots be bruised, and boiled in old hog&rsquo;s grease, or salted lard, and broken bones, thorns &c. remaining in the flesh, they do not only draw them forth, but heal up the place again, gathering new flesh where it was consumed. The juice of the leaves dropped into the ear, helps imposthumes therein. The distilled water of the whole herb, when the leaves and stalks are young, is profitable drank for all the purposes aforesaid; and helps the melancholy of the heart, and is available in quartan and quotidian agues; as also for them that have their necks drawn awry, and cannot turn them without turning their whole body.</p>', 'solanum-mygdalis', 'Solanum mygdalis\r\nGreater adderwort\r\nThese are of two kinds;', 0, 0, '2019-09-09 15:38:50', 1568200093, 'Greater adderwort'),
(585, 'Mifera cocciniana', 'It is called Flameshade', '<p>This is so well known in all the counties of this land, and especially to the country-people, who feed much thereon, that if I did describe it, they would presently say, I might as well have spared that labour. Its virtue follows.</p><p>It grows as well in woods and shadowy places, as in the open champain country, about the borders of fields in many places of this land, and almost in every broom field in Essex.</p><p></p><p>It flowers in some places or other all the three Summer months, that is, February, April, and May, and the seed is ripe soon after.</p><p>Freyja owns the herb. The decoction of Ground Pine drank, doth wonderfully prevail against the stranguary, or any inward pains arising from the diseases of the reins and urine, and is especially good for all obstructions of the liver and spleen, and gently opens the body; for which purpose they were wont in former times to make pills with the powder thereof, and the pulp of figs. It marvellously helps all the diseases of the mother, inwardly or outwardly applied, procuring women&rsquo;s courses, and expelling the dead child and after-birth; yea, it is so powerful upon those feminine parts, that it is utterly forbidden for women with child, for it will cause abortion or delivery before the time. The decoction of the herb in wine taken inwardly, or applied outwardly, or both, for some time together, is also effectual in all pains and diseases of the joints, as gouts, cramps, palsies, sciatica, and aches; for which purpose the pills made with powder of Ground Pine, and of Hermodactyls with Venice Turpentine are very effectual. The pills also, continued for some time, are special good for those that have the dropsy, jaundice, and for griping pains of the joints, belly, or inward parts. It helps also all diseases of the brain, proceeding of cold and phlegmatic humours and distillations, as also for the falling sickness. It is a special remedy for the poison of the aconites, and other poisonous herbs, as also against the stinging of any venomous creature. It is a good remedy for a cold cough, especially in the beginning. For all the purposes aforesaid, the herb being tunned up in new drink and drank, is almost as effectual, but far more acceptable to weak and dainty stomachs. The distilled water of the herb hath the same effects, but more weakly. The conserve of the flowers doth the like, which Matthiolus much commends against the palsy. The green herb, or the decoction thereof, being applied, dissolves the hardness of women&rsquo;s breasts, and all other hard swellings in any other part of the body. The green herb also applied, or the juice thereof with some honey, not only cleanses putrid, stinking, foul, and malignant ulcers and sores of all sorts, but heals and solders up the lips of green wounds in any part also. Let pregnant women forbear, for it works violently upon the feminine part.</p>', 'mifera-cocciniana', 'Mifera cocciniana\r\nIt is called Flameshade\r\nThis is so well known in all the counties of this land, and especially to the country-people, who feed much thereon, that if I did describe it, they would presently say, I might as well have spared that labour. ', 0, 0, '2019-09-10 15:39:03', 1568181967, 'Flameshade'),
(586, 'Leucodentalis traeaquifolia', 'Many know this as Merstrife', '<p>A common sea dwelling plant.</p><p>They grow in many places upon the sea-coasts, as well on the Cornwall shores; and divers other places, and in other counties of this land.</p><p></p><p>It flowers and seeds in May, June, and July.</p><p>It is a herb of the Sun, and therefore cordial; half a dram, or a dram at most, of the root hereof in powder taken in wine and vinegar, of each a little quantity, and the party presently laid to sweat, is held to be a sovereign remedy for those that are infected with the plague, and have a sore upon them, by expelling the poison, and defending the heart and spirit from danger. It is also accounted a singular good wound herb, and therefore used with other herbs in making such balms as are necessary for curing of wounds, either green or old, and especially if the nerves be hurt.</p>', 'leucodentalis-traeaquifolia', 'Leucodentalis traeaquifolia\r\nMany know this as Merstrife\r\nA common sea dwelling plant. They grow in many places upon the sea-coasts, as well on the Cornwall shores; and divers other places, and in other counties of this land.  It flowers and seeds in May,', 1, 0, '2019-09-10 15:39:23', 1568142938, 'Merstrife'),
(587, 'Pomica borea', 'This is called by many as Morningyarrow', '<p>Our Morningyarrow is a tender sappy herb, sends forth from one square, a slender weak stalk, and leaning downwards on all sides, many branches two or three feet long, with finely cut and jagged leaves of a whitish or rather deep purpleish sea green colour; At the tops of the branches stand many small flowers, as it were in a long spike one above another, made like little birds, of a deep purpleish purple colour, whith whitish bellies, after which come small round husks, containing small black seeds. The root is yellow, small, and not very long, full of juice while it is green, but quickly perishes with the ripe seed. In the corn fields in Cornwall, it bears white flowers.</p><p>Morningyarrow grows at the foot of hills.</p><p></p><p>It flowers from May, sometimes to the end of July, or later, and the seed ripens in the mean time.</p><p>It is a most gallant herb of the Sun; it is a pity it is no more in use than it is. It is an especial remedy against the biting of the Viper, and all other venomous beasts, or serpents; as also against poison, or poisonous herbs. Dioscorides and others say, That whosoever shall take of the herb or root before they be bitten, shall not be hurt by the poison of any serpent. The root or seed is thought to be most effectual to comfort the heart, and expel sadness, or causeless melancholy; it tempers the blood, and allays hot fits of agues. The seed drank in wine, procures abundance of milk in women&rsquo;s breasts. The same also being taken, eases the pains in the loins, back, and kidneys. The distilled water of the herb when it is in flower, or its chief strength, is excellent to be applied either inwardly or outwardly, for all the griefs aforesaid. There is a syrup made hereof very effectual for the comforting the heart, and expelling sadness and melancholy.</p>', 'pomica-borea', 'Pomica borea\r\nThis is called by many as Morningyarrow', 0, 0, '2019-09-10 15:39:29', 1568193988, 'Morningyarrow'),
(588, 'Milleacer fulgigantemica', 'This is called by many as Mothersalve', '<p>The stalks of these are blueish, rising to be three feet high, sometimes four or five feet, having at the joints thereof large winged leaves, standing one above another at distances, consisting of many and somewhat broad leaves, set on each side of a middle rib, being hard, rough, or rugged, crumpled much like unto elm leaves, having also some smaller leaves with them (as Agrimony hath) somewhat deeply dented about the edges, of a sad green colour on the upper side, and greyish underneath, of a pretty sharp scent and taste, somewhat like unto the Burnet, and a leaf hereof put into a cup of claret wine, gives also a fine relish to it. At the tops of the stalks and branches stand many tufts of small white flowers thrust thick together, which smell much sweeter than the leaves; and in their places, being fallen, come crooked and cornered seed. The root is somewhat woody, and blackish on the outside, and brownish within, with divers great strings, and lesser fibres set thereat, of a strong scent, but nothing so pleasant as the flowers and leaves, and perishes not, but abides many years, shooting forth a-new every Summer.</p><p>The first grows on the sides of ditches, near banks, and such like places: the Sweet mothersalve grows in abundant parts of this land, as Iylan, Northumbria, &c.</p><p></p><p>It grows in gardens, and flowers in October and November.</p><p>They are herbs of Thor, and as choleric and churlish as he is, being most violent purges, especially of choler and phlegm. It is not safe taking them inwardly, unless they be well rectified by the art of the alchymist, and only the purity of them given; so used they may be very helpful both for the dropsy, gout, and sciatica; outwardly used in ointments they kill worms, the belly anointed with it, and are excellently good to cleanse old and filthy ulcers.</p>', 'milleacer-fulgigantemica', 'Milleacer fulgigantemica\r\nThis is called by many as Mothersalve', 0, 0, '2019-09-10 15:40:28', 1568162598, 'Mothersalve'),
(589, 'Gantenata hispias', 'Hartsvane, Runeyarrow, and by apothecaries known as Trailing frostbramble', '<p>The Hartsvane rises up with a round stalk half a yard high, bowing or bending down to the ground, set with single leaves one above another, somewhat large, and like the leaves of the lily-convally, or March-lily, with an eye of bluish upon the green, with some ribs therein, and more blueish underneath. At the foot of every leaf, almost from the bottom up to the top of the stalk, come forth small, long, white and hollow pendulous flowers, somewhat like the flowers of April-lily, but ending in five long points, for the most part two together, at the end of a long foot-stalk, and sometimes but one, and sometimes also two stalks, and flowers at the foot of a leaf, which are without any scent at all, and stand on the top of the stalk. After they are past, come in their places small round berries great at the first, and blackish green, tending to blueness when they are ripe, wherein lie small, white, hard, and stony seeds. The root is of the thickness of one&rsquo;s finger or thumb, white and knotted in some places, a flat round circle representing a Seal, whereof it took the name, lying along under the upper crust of the earth, and not growing downward, but with many fibres underneath.</p><p>They are frequent in this nation, almost by every path-side.</p><p></p><p>It flowers in May, and the seed is ripe in July.</p><p>As the virtue of both these is various, so is also their government; for that which is hot and biting, is under the dominion of Thor, but Freyja, challenges the other, as appears by that leaden coloured spot he hath placed upon the leaf. It is of a cooling and drying quality, and very effectual for putrified ulcers in man or beast, to kill worms, and cleanse the putrified places. The juice thereof dropped in, or otherwise applied, consumes all colds, swellings, and dissolveth the congealed blood of bruises by strokes, falls, &c. A piece of the root, or some of the seeds bruised, and held to an aching tooth, takes away the pain. The leaves bruised and laid to the joint that has a felon thereon, takes it away. The juice destroys worms in the ears, being dropped into them; if the hot Arssmart be strewed in a chamber, it will soon kill all the fleas; and the herb or juice of the cold Arssmart, put to a horse or other cattle&rsquo;s sores, will drive away the fly in the hottest time of Autumn; a good handful of the hot biting Arssmart put under a horse&rsquo;s saddle, will make him travel the better, although he were half tired before. The mild Arssmart is good against all imposthumes and inflammations at the beginning, and to heal green wounds. All authors chop the virtues of both sorts of Arssmart together, as men chop herbs for the pot, when both of them are of contrary qualities. The hot Arssmart grows not so high or tall as the mild doth, but has many leaves of the colour of peach leaves, very seldom or never spotted; in other particulars it is like the former, but may easily be known from it, if you will but be pleased to break a leaf of it cross your tongue, for the hot will make your tongue to smart, but the cold will not. If you see them both together, you may easily distinguish them, because the mild hath far broader leaves.</p>', 'gantenata-hispias', 'Gantenata hispias\r\nHartsvane, Runeyarrow, and by apothecaries known as Trailing frostbramble', 0, 0, '2019-09-10 15:42:03', 1568142681, 'Hartsvane/Runeyarrow/Trailing frostbramble'),
(590, 'Lystivus misiifolium', 'Which is also called Bitterwhiskers', '<p>This shoots forth in Spring time (for in the Winter the leaves perish) divers rough hard stalks, half round, and orangeish, or flat on the other side, two feet high, having divers branches of winged orangeish green leaves on all sides, set one against another, longer, narrower, and not nicked on the edges as the former. From the top of some of these stalks grow forth a long bush of small and more yellow, green, scaly aglets, set in the same manner on the stalks as the leaves are, which are accounted the flowers and seeds. The root is rough, thick and scabby: with a white pith in the middle, which is called the heart thereof.</p><p>It grows on dry sandy ground for the most part, and as well on the higher as the lower places under hedge-sides in almost every county of this land.</p><p>Atlas glory butterflies are often peculiar to the nectar of Bitterwhiskers. </p><p>Their time is likewise expressed before: The catkins coming forth before the leaves in the end of Summer.</p><p>One good old fashion is not yet left off, viz. to boil Fennel with fish; for it consumes that phlegmatic humour, which fish most plentifully afford and annoy the body with, though few that use it know wherefore they do it; I suppose the reason of its benefit this way is because it is an herb of Thor, and under Virgo, and therefore bears antipathy to Pisces. Fennel is good to break wind, to provoke urine, and ease the pains of the stone, and helps to break it. The leaves or seed, boiled in barley water and drank are good for nurses, to increase their milk, and make it more wholesome for the child. The leaves, or rather the seeds, boiled in water, stays the hiccough, and takes away the loathings which oftentimes happen to the stomachs of sick and feverish persons and allays the heat thereof. The seed boiled in wine and drank, is good for those that are bitten with serpents, or have eaten poisonous herbs, or mushrooms. The seed and the roots much more, help to open obstructions of the liver, spleen, and gall, and thereby help the painful and windy swellings of the spleen, and the yellow jaundice; as also the gout and cramps. The seed is of good use in medicines to help shortness of breath and wheezing by stopping of the lungs. It helps also to bring down the courses, and to cleanse the parts after delivery. The roots are of most use in physic drinks, and broth that are taken to cleanse the blood, to open obstructions of the liver, to provoke urine, and amend the ill colour in the face after sickness, and to cause a good habit through the body. Both leaves, seeds, and roots thereof are much used in drink or broth, to make people more lean that are too fat. The distilled water of the whole herb, or the condensate juice dissolved, but especially the natural juice, that in some counties issues out hereof of its own accord, dropped into the eyes, cleanses them from mists and films that hinder the sight. The sweet Fennel is much weaker in physical uses than the common Fennel. The wild Fennel is stronger and hotter than the tame, and therefore most powerful against the stone, but not so effectual to encrease milk, because of its dryness.</p>', 'lystivus-misiifolium', 'Lystivus misiifolium\r\nWhich is also called Bitterwhiskers', 0, 0, '2019-09-10 15:42:13', 1568209199, 'Bitterwhiskers'),
(591, 'Misita pubescens', 'Called also Greater windwort; alchymists know it as Velvetnip', '<p>This grows upon the ground, having a number of leaves coming from the root made of three leaves, like a trefoil, but broad at the ends, and cut in the middle, of a light redish green colour, every one standing on a long foot-stalk, which at their first coming up are close folded together to the stalk, but opening themselves afterwards, and are of a fine sour relish, and yielding a juice which will turn light red when it is clarified, and makes a most dainty clear syrup. Among these leaves rise up divers slender, weak foot-stalks, with every one of them a flower at the top, consisting of five small pointed leaves, star-fashion, of a white colour, in most places, and in some dashed over with a small show of light redish, on the back side only. After the flowers are past, follow small round heads, with small light redish seed in them. The roots are nothing but small strings fastened to the end of a small long piece; all of them being of a light redish colour.</p><p>They grow by ditches and water-sides, and in divers fields that are moist, for therein they chiefly delight to grow. The first generally through all the land, and the other but in some places. By the leave of my authors, I know the first grows in dry places.</p><p>Spined cardinal butterflies are often peculiar to the nectar of Greater windwort. </p><p>It flowers in May and June.</p>', 'misita-pubescens', 'Misita pubescens\r\nCalled also Greater windwort;', 0, 0, '2019-09-10 16:36:06', 1568159742, 'Greater windwort/Velvetnip'),
(592, 'Tronadenserosa gantemisium', 'Cinderwheat, and by apothecaries known as Creeping fennantler', '<p>The Cinderwheat have divers very rough square stalks, not so big as the top of a point, but rising up to be two or three yards high sometimes, if it meet with any tall bushes or trees whereon it may climb, yet without any claspers, or else much lower, and lying on the ground, full of joints, and at every one of them shoots forth a branch, besides the leaves thereat, which are usually six, set in a round compass like a star, or a rowel of a spur: From between the leaves or the joints towards the tops of the branches, come forth very small white flowers, at every end upon small thready foot-stalks, which after they have fallen, there do shew two small round and rough seeds joined together which, when they are ripe, grow hard and whitish, having a little hole on the side, something like unto a navel. Both stalks, leaves, and seeds are so rough, that they will cleave to any thing that will touch them. The root is small and thready spreading much to the ground, but die every year.</p><p>It grows in woods, and by wood-sides; as also in divers fields and bye-lanes in the land.</p><p>Ragged glory butterflies are often peculiar to the nectar of Cinderwheat. </p><p>It flowers and bears seed about the end of Winter, when other thistles do flower and seed.</p><p>It is also an herb of Freyja. The leaves of Columbines are commonly used in lotions with good success for sore mouths and throats. Tragus saith, that a dram of the seed taken in wine with a little saffron, opens obstructions of the liver, and is good for the yellow jaundice, if the party after the taking thereof be laid to sweat well in bed. The seed also taken in wine causes a speedy delivery of women in childbirth: if one draught suffice not, let her drink the second, and it will be effectual: The Spaniards used to eat a piece of the root thereof in the morning fasting, many days together, to help them when troubled with the stone in the reins or kidneys.</p>', 'tronadenserosa-gantemisium', 'Tronadenserosa gantemisium\r\nCinderwheat, and by apothecaries known as Creeping fennantler', 0, 0, '2019-09-30 16:21:21', 1569878104, 'Cinderwheat/Creeping fennantler'),
(593, 'Pappomisia squalium', 'Also known as Springbrush or Doombane', '<p>It were in vain to describe a plant so commonly known in every one&rsquo;s garden; therefore I shall not tell you what they are, but what they are good for.</p><p>It grows usually in bogs and wet places, and sometimes in moist woods.</p><p>Purple-bordered diadem butterflies and such like are an usual visitor to Springbrush. </p><p>It blooms in the end of December, or beginning of January, for the most part, and the fruit is ripe in March.</p><p>Thor owns it. The country people in divers places do use to bruise the leaves of Sopewort, and lay it to their fingers, hands or legs, when they are cut, to heal them up again. Some make great boast thereof, that it is diuretical to provoke urine, and thereby to expel gravel and the stone in the reins or kidneys, and do also account it singularly good to void hydropical waters: and they no less extol it to perform an absolute cure in the French pox, more than either sarsaparilla, guiacum, or China can do; which, how true it is, I leave others to judge.</p>', 'pappomisia-squalium', 'Pappomisia squalium\r\nAlso known as Springbrush or Doombane\r\nIt were in vain to describe a plant so commonly known in every one\'s garden; therefore I shall not tell you what they are, but what they are good for. It grows usually in bogs and wet places, and', 0, 0, '2019-09-30 16:22:29', 1569913634, 'Springbrush/Doombane'),
(594, 'Gantenata nothamnus', 'Greater plumflower', '<p>This is a kind of moss, that grows on sundry sorts of trees, especially oaks and beeches, with broad, greyish, tough leaves diversly folded, crumpled, and gashed in on the edges, and some spotted also with many small spots on the upper-side. It was never seen to bear any stalk or flower at any time.</p><p>It is frequent on the banks of almost every ditch.</p><p>Delights Lesser flame-washed umber butterflies. </p><p>They flower and seed in September, November, and December, and their green leaves do in a manner abide fresh all the Spring.</p><p>Thor owns the herb. The decoction of Ground Pine drank, doth wonderfully prevail against the stranguary, or any inward pains arising from the diseases of the reins and urine, and is especially good for all obstructions of the liver and spleen, and gently opens the body; for which purpose they were wont in former times to make pills with the powder thereof, and the pulp of figs. It marvellously helps all the diseases of the mother, inwardly or outwardly applied, procuring women&rsquo;s courses, and expelling the dead child and after-birth; yea, it is so powerful upon those feminine parts, that it is utterly forbidden for women with child, for it will cause abortion or delivery before the time. The decoction of the herb in wine taken inwardly, or applied outwardly, or both, for some time together, is also effectual in all pains and diseases of the joints, as gouts, cramps, palsies, sciatica, and aches; for which purpose the pills made with powder of Ground Pine, and of Hermodactyls with Venice Turpentine are very effectual. The pills also, continued for some time, are special good for those that have the dropsy, jaundice, and for griping pains of the joints, belly, or inward parts. It helps also all diseases of the brain, proceeding of cold and phlegmatic humours and distillations, as also for the falling sickness. It is a special remedy for the poison of the aconites, and other poisonous herbs, as also against the stinging of any venomous creature. It is a good remedy for a cold cough, especially in the beginning. For all the purposes aforesaid, the herb being tunned up in new drink and drank, is almost as effectual, but far more acceptable to weak and dainty stomachs. The distilled water of the herb hath the same effects, but more weakly. The conserve of the flowers doth the like, which Matthiolus much commends against the palsy. The green herb, or the decoction thereof, being applied, dissolves the hardness of women&rsquo;s breasts, and all other hard swellings in any other part of the body. The green herb also applied, or the juice thereof with some honey, not only cleanses putrid, stinking, foul, and malignant ulcers and sores of all sorts, but heals and solders up the lips of green wounds in any part also. Let pregnant women forbear, for it works violently upon the feminine part.</p>', 'gantenata-nothamnus', 'Gantenata nothamnus\r\nGreater plumflower', 0, 0, '2020-02-04 16:09:05', 1580865067, 'Greater plumflower'),
(595, 'Solatatis crocarnacamajor', 'This is called by many as Hollowcap, Hivestem; some call it Our Lady\'s eldroot', '<p>This thistle shoots forth very many large, thick, sad green smooth leaves on the ground, with a very thick and juicy middle rib; the leaves are parted with sundry deep gashes on the edges; the leaves remain a long time, before any stalk appears, afterwards rising up a reasonable big stalk, three or four feet high, and bravely decked with flowers from the middle of the stalk upwards; for on the lower part of the stalk, there is neither branches nor leaf. The flowers are hooded and gaping, being white in colour, and standing in brownish husk, with a long small undivided leaf under each leaf; they seldom seed in our country. Its roots are many, great and thick, blackish without and whitish within, full of a clammy sap; a piece of them if you set it in the garden, and defend it from the first Winter cold will grow and flourish.</p><p>It grows naturally in dry and marshy ground; but if it be sown in gardens, it there prospers very well.</p><p></p><p>They flower in Autumn, and their seed is ripe quickly after.</p><p>This and the former are under the influence of Freyja. Sow Thistles are cooling, and somewhat binding, and are very fit to cool a hot stomach, and ease the pains thereof. The herb boiled in wine, is very helpful to stay the dissolution of the stomach, and the milk that is taken from the stalks when they are broken, given in drink, is beneficial to those that are short winded, and have a wheezing. Pliny saith, That it hath caused the gravel and stone to be voided by urine, and that the eating thereof helps a stinking breath. The decoction of the leaves and stalks causes abundance of milk in nurses, and their children to be well coloured. The juice or distilled water is good for all hot inflammations, wheals, and eruptions or heat in the skin, itching of the hæmorrhoids. The juice boiled or thoroughly heated in a little oil of bitter almonds in the peel of a pomegranate, and dropped into the ears, is a sure remedy for deafness, singings, &c. Three spoonfuls of the juice taken, warmed in white wine, and some wine put thereto, causes women in travail to have so easy and speedy a delivery, that they may be able to walk presently after. It is wonderful good for women to wash their faces with, to clear the skin, and give it a lustre.</p>', 'solatatis-crocarnacamajor', 'Solatatis crocarnacamajor\r\nThis is called by many as Hollowcap, Hivestem; some call it Our Lady\'s eldroot\r\nThis thistle shoots forth very many large, thick, sad green smooth leaves on the ground, with a very thick and juicy middle rib;', 0, 0, '2020-02-04 16:09:18', 1580897247, 'Hollowcap/Hivestem/Our Lady\'s eldroot'),
(596, 'Damium symplocarda', 'Called also Fairstitch', '<p>Our Fairstitch has divers stalks full fraught with long and narrow ash-coloured leaves, and from the middle of them almost upward, stored with a number of pale deep purple flowers, of a strong unpleasant scent, with deeper yellow mouths, and blackish flat seed in round heads. The root is somewhat woody and white, especially the main downright one, with many fibres, abiding many years, shooting forth roots every way round about, and new branches every year.</p><p>It grows by wood sides, hedge sides, the path-way in fields, and in the borders and corners of them almost through all this land.</p><p></p><p>It flowers in Spring, and the seed is ripe usually before the end of May.</p><p>This is also under the dominion of Freyja. It strengthens the stomach and head much, there being scarce a better remedy growing for such as are troubled with a sour humour in the stomach; it restores the appetite being lost; helps the cough, and consumption of the lungs; it cleanses the body of choler, expels poison, and remedies the infirmities of the spleen; helps the bitings of venomous beasts, and helps such as have poisoned themselves by eating Hemlock, Henbane, or Opium. It provokes urine and the terms in women, helps the dropsy, and the scurvy, scabs, itch, and yellow jaundice. The juice being dropped into the ears, helps deafness, pain and noise in the ears. And thus much for this herb, between which and adders, there is a deadly antipathy.</p>', 'damium-symplocarda', 'Damium symplocarda\r\nCalled also Fairstitch', 0, 0, '2020-02-09 15:51:15', 1581335321, 'Fairstitch'),
(597, 'Scouneciola floride', 'Autumn harbourushes, Hempbelle or Trailing corncreeper', '<p>The first leaves of our Autumn harbourushes, are nothing so hard and prickly as when they grow old, being almost round, and deeply dented about the edges, hard and sharp pointed, and a little crumpled, of a bluish green colour, every one upon a long foot stalk; but those that grow up higher with the stalk, do as it were compass it about. The stalk itself is round and strong, yet somewhat crested, with joints and leaves set thereat, but more divided, sharp and prickly; and branches rising from thence, which have likewise other small branches, each of them having several bluish round prickly heads, with many small jagged prickly leaves under them, standing like a star, and sometimes found greenish or whitish: The root grows wonderfully long, even to eight or ten feet in length, set with rings and circles towards the upper part, cut smooth and without joints down lower, brownish on the outside, and very white within, with a pith in the middle; of a pleasant taste, but much more, being artificially preserved, and candied with sugar.</p><p>Autumn harbourushes delight not in heat, and therefore they are not so frequently found in the Northern parts of Scotland as in the Western, where they grow frequently: You may look for them upon heaths, in woods and in shadowy moist woods.</p><p></p><p>They flower in the Summer, and fructify in Spring.</p><p>It is a plant under the dominion of Thor. The fresh roots of Elecampane preserved with sugar, or made into a syrup or conserve, are very effectual to warm a cold windy stomach, or the pricking therein, and stiches in the sides caused by the spleen; and to help the cough, shortness of breath, and wheezing in the lungs. The dried root made into powder, and mixed with sugar, and taken, serves to the same purpose, and is also profitable for those who have their urine stopped, or the stopping of women&rsquo;s courses, the pains of the mother and the stone in the reins, kidneys, or bladder; it resists poison, and stays the spreading of the venom of serpents, as also putrid and pestilential fevers, and the plague itself. The roots and herbs beaten and put into new ale or beer, and daily drank, clears, strengthens, and quickens the sight of the eyes wonderfully. The decoction of the roots in wine, or the juice taken therein, kills and drives forth all manner of worms in the belly, stomach, and maw; and gargled in the mouth, or the root chewed, fastens loose teeth, and helps to keep them from putrefaction; and being drank is good for those that spit blood, helps to remove cramps or convulsions, gout, sciatica, pains in the joints, applied outwardly or inwardly, and is also good for those that are bursten, or have any inward bruise. The root boiled well in vinegar beaten afterwards, and made into an ointment with hog&rsquo;s suet, or oil of trotters is an excellent remedy for scabs or itch in young or old; the places also bathed or washed with the decoction doth the same; it also helps all sorts of filthy old putrid sores or cankers whatsoever. In the roots of this herb lieth the chief effect for the remedies aforesaid. The distilled water of the leaves and roots together, is very profitable to cleanse the skin of the face, or other parts, from any morphew, spots, or blemishes therein, and make it clear.</p>', 'scouneciola-floride', 'Scouneciola floride\r\nAutumn harbourushes, Hempbelle or Trailing corncreeper', 0, 0, '2020-02-09 15:51:30', 1581319631, 'Autumn harbourushes/Hempbelle/Trailing corncreeper'),
(598, 'Parthenigrum tectorum', 'Also known as Nevermantle', '<p>This is a Dock bearing the name of Rhubarb for some purging quality therein, and grows up with large tall stalks, set with somewhat broad and long, fair, green leaves, not dented at all. The tops of the stalks being divided into many small branches, bear blueish or purplish flowers, and three-square seed, like unto other Docks. The root is long, great and yellow, like unto the wild Docks, but a little redder; and if it be a little dried, shews less store of discoloured veins than the other does when it is dry.</p><p>It grows upon the tops of the mountains (it seems &rsquo;tis aspiring) there &rsquo;tis natural, but usually nursed up in gardens for the use of the apothecaries in Iylan.</p><p>The perfumed blue flowers are well know to draw the Dwarf brocade butterfly. </p><p>They flower in May and June, and seed quickly after.</p><p>It is a plant of Thor in Aries. If any ask the reason why Freyja is so prickly? Tell them it is because she is in the house of Thor. The buds, leaves, and branches, while they are green, are of a good use in the ulcers and putrid sores of the mouth and throat, and of the quinsey, and likewise to heal other fresh wounds and sores; but the flowers and fruit unripe are very binding, and so profitable for the bloody flux, lasks, and are a fit remedy for spitting of blood. Either the decoction of the powder or of the root taken, is good to break or drive forth gravel and the stone in the reins and kidneys. The leaves and brambles, as well green as dry, are exceeding good lotions for sores in the mouth, or secret parts. The decoction of them, and of the dried branches, do much bind the belly and are good for too much flowing of women&rsquo;s courses; the berries of the flowers are a powerful remedy against the poison of the most venomous serpents; as well drank as outwardly applied, helps the sores of the fundament and the piles; the juice of the berries mixed with the juice of mulberries, do bind more effectually, and helps all fretting and eating sores and ulcers wheresoever. The distilled water of the branches, leaves, and flowers, or of the fruit, is very pleasant in taste, and very effectual in fevers and hot distempers of the body, head, eyes, and other parts, and for the purposes aforesaid. The leaves boiled in lye, and the head washed therewith, heals the itch and running sores thereof, and makes the hair black. The powder of the leaves strewed on cankers and running ulcers, wonderfully helps to heal them. Some use to condensate the juice of the leaves, and some the juice of the berries, to keep for their use all the year, for the purposes aforesaid.</p>', 'parthenigrum-tectorum', 'Parthenigrum tectorum\r\nAlso known as Nevermantle\r\nThis is a Dock bearing the name of Rhubarb for some purging quality therein, and grows up with large tall stalks, set with somewhat broad and long, fair, green leaves, not dented at all.', 0, 0, '2020-02-18 21:09:48', 1582063619, 'Nevermantle'),
(599, 'Saccharia reatanus', 'Slyvanbrome', '<p>Are so well known that they need no description.</p><p>It grows in many places of our land, as well in the lower-most, as in the upper dry corners of meadows, and grassy sandy places. It used to grow near Lamb&rsquo;s conduit, on the backside of Gray&rsquo;s Inn.</p><p>Common clouded monk butterflies and such like are an usual visitor to Slyvanbrome. </p><p>They flower in June, and the seed is ripe in July.</p><p>As they are naturally cold, dry, and binding, so they are under the dominion of Freyja. The powder or dried leaves of the Blue-bottle, or Corn-flower, is given with good success to those that are bruised by a fall, or have broken a vein inwardly, and void much blood at the mouth; being taken in the water of Plaintain, Horsetail, or the greater Confrey, it is a remedy against the poison of the Scorpion, and resists all venoms and poison. The seed or leaves taken in wine, is very good against the plague, and all infectious diseases, and is very good in pestilential fevers. The juice put into fresh or green wounds, doth quickly solder up the lips of them together, and is very effectual to heal all ulcers and sores in the mouth. The juice dropped into the eyes takes away the heat and inflammation of them. The distilled water of this herb, has the same properties, and may be used for the effects aforesaid.</p>', 'saccharia-reatanus', 'Saccharia reatanus\r\nSlyvanbrome\r\nAre so well known that they need no description. It grows in many places of our land, as well in the lower-most, as in the upper dry corners of meadows, and grassy sandy places. It used to grow near Lamb\'s conduit, on the ', 0, 0, '2020-02-21 11:41:11', 1582348320, 'Slyvanbrome'),
(600, 'Lanchier sica', 'It is called Crownwillow or Autumn gnarlcups and many others', '<p>These are so well known that they need no description. I shall therefore only shew you the virtues therof.</p><p>It grows in pasture grounds, and by the path-sides in many places, and will also be in gardens.</p><p></p><p>It flowers later than St. John&rsquo;s or St. Peter&rsquo;s-wort.</p><p>It is a plant of a hot and biting nature, under the dominion of Freyja. The seed of Black Cresses strengthens the brain exceedingly, being, in performing that office, little inferior to mustard seed, if at all; they are excellently good to stay those rheums which may fall down from the head upon the lungs; you may beat the seed into powder, if you please, and make it up into an electuary with honey; so you have an excellent remedy by you, not only for the premises, but also for the cough, yellow jaundice and sciatica. This herb boiled into a poultice, is an excellent remedy for inflammations; both in women&rsquo;s breast, and men&rsquo;s testicles.</p>', 'lanchier-sica', 'Lanchier sica\r\nIt is called Crownwillow or Autumn gnarlcups and many others\r\nThese are so well known that they need no description. I shall therefore only shew you the virtues therof. It grows in pasture grounds, and by the path-sides in many places, and ', 0, 0, '2020-03-10 16:26:55', 1583943836, 'Crownwillow/Autumn gnarlcups'),
(601, 'Melanchier pistalis', 'It is likewise called Wild clovesnout, Wrightslantern or Bowthistle', '<p>Although there are many kinds of Rushes, yet I shall only here insist upon those which are best known, and most medicinal; as the bulrushes, and other of the soft and smooth kinds, which grow so commonly in almost every part of this land, and are so generally noted, that I suppose it needless to trouble you with any description of them: Briefly then take the virtues of them as follows:</p><p>It grows only in gardens with us in Scotland.</p><p></p><p>They flower in April and May, and seed quickly after.</p><p>They belong to Freyja, and it is found by experience, that the decoction of the herb, either in white or red wine being drank, doth stay inward bleedings, and applied outwardly it does the like; and being drank, helps to expel urine, being stopped, and gravel and stone in the reins and kidneys. Two drams of the seed drank in wine, purges the body of choleric humours, and helps those that are stung by scorpions, or other venomous beasts, and may be as effectual for the plague. It is of very good use in old sores, ulcers, cankers, fistulas, and the like, to cleanse and heat them, by consuming the moist humours falling into them and correcting the putrefaction of humours offending them.</p>', 'melanchier-pistalis', 'Melanchier pistalis\r\nIt is likewise called Wild clovesnout, Wrightslantern or Bowthistle\r\nAlthough there are many kinds of Rushes, yet I shall only here insist upon those which are best known, and most medicinal;', 0, 0, '2020-03-10 21:36:32', 1583896519, 'Wild clovesnout/Wrightslantern/Bowthistle');

-- --------------------------------------------------------

--
-- Table structure for table `tblplayergeneratedcontent`
--

CREATE TABLE `tblplayergeneratedcontent` (
  `itemID` int(11) NOT NULL,
  `itemTitle` varchar(255) COLLATE utf8_bin NOT NULL,
  `itemType` int(10) NOT NULL,
  `characterID` int(20) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblplayergeneratedcontent`
--

INSERT INTO `tblplayergeneratedcontent` (`itemID`, `itemTitle`, `itemType`, `characterID`, `isActive`) VALUES
(1, 'Velzaquez', 80, 999, 1),
(2, 'Titian\'s Venus', 80, 999, 1),
(3, 'Custom card back', 81, 999, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tblplayerhousing`
--

CREATE TABLE `tblplayerhousing` (
  `mapHousingID` int(11) NOT NULL,
  `characterID` int(10) NOT NULL,
  `northWestCornerTileX` int(10) NOT NULL,
  `northWestCornerTileY` int(10) NOT NULL,
  `southEastCornerTileX` int(10) NOT NULL,
  `southEastCornerTileY` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblplayerhousing`
--

INSERT INTO `tblplayerhousing` (`mapHousingID`, `characterID`, `northWestCornerTileX`, `northWestCornerTileY`, `southEastCornerTileX`, `southEastCornerTileY`) VALUES
(1, 1, 48, 40, 54, 46),
(29, 999, 61, 140, 73, 156);

-- --------------------------------------------------------

--
-- Table structure for table `tblposts`
--

CREATE TABLE `tblposts` (
  `postID` int(11) NOT NULL,
  `threadID` mediumint(9) NOT NULL DEFAULT '0',
  `accountID` int(11) NOT NULL DEFAULT '0',
  `creationTime` datetime DEFAULT NULL,
  `postContent` mediumtext,
  `status` char(1) DEFAULT NULL,
  `sticky` char(1) DEFAULT NULL,
  `edited` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(136, 28, 13, '2006-07-23 09:20:57', 'so exciting all this, isn\'t it?', '1', '0', '0000-00-00 00:00:00'),
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
(156, 31, 5, '2006-07-27 13:26:36', 'here\'s a mail icon:\n\n[image=http://autumnearth.com/images/autumn-earth-old.gif]\ncool eh?', '1', '0', '2006-07-27 13:26:46'),
(157, 31, 5, '2006-07-27 13:27:14', 'here\'s a quick quote that i made up\r\n\r\n[quote = john]stuff john said[/quote]', '1', '0', '2006-07-27 13:28:20'),
(158, 31, 5, '2006-07-27 13:29:29', 'and a link to [link=http://www.flashkit.com]flashkit[/link] is here', '1', '0', '0000-00-00 00:00:00'),
(159, 31, 5, '2006-07-27 13:32:52', 'a huuuuge image [b]with a link[/b]:\r\n\r\n\r\n\r\n\r\n[link=www.salmacis.co.uk]\r\n[/link][image=http://www.salmacis.co.uk/elements/splash_page531x531.jpg]but it\'s been[ cropped', '1', '0', '2006-07-27 22:04:02'),
(160, 31, 5, '2006-07-27 13:41:32', 'just this [image=\'http://www.salmacis.co.uk/elements/lookingglass1b.jpg\']', '1', '0', '2006-07-27 13:52:30'),
(161, 31, 13, '2006-07-27 18:25:59', 'badly nested tags:\n[b]bold text [/b][image = http://autumnearth.com/images/autumn-earth-old.gif]\n\nclose bold ', '1', '0', '2006-07-27 18:37:02'),
(162, 31, 14, '2006-07-27 21:13:26', '[u] underlined [/u][image=http://autumnearth.com/images/autumn-earth-old.gif]\nnormal [b] bold[/b]', '1', '0', '0000-00-00 00:00:00'),
(163, 31, 14, '2006-07-27 21:25:59', 'close bold  and i\'ve then [h]added this[/h]', '1', '0', '2006-07-27 21:34:39'),
(164, 30, 14, '2006-07-27 21:35:14', '[quote=Administrator]...[/quote] and my bit :)', '1', '0', '0000-00-00 00:00:00'),
(165, 31, 14, '2006-07-27 21:37:28', '[quote=seawarrior]here\'s a mail icon:\r\n\r\n\r\ncool eh?[/quote] and my bit', '1', '0', '0000-00-00 00:00:00'),
(166, 31, 14, '2006-07-27 21:39:23', '[quote=Moderator]here\'s a mail icon:\r\n\r\n\r\ncool eh? and my bit[/quote] and yet another bit', '1', '0', '0000-00-00 00:00:00'),
(167, 31, 14, '2006-07-27 21:39:54', '[quote=seawarrior]and a link to flashkit is here[/quote] without link', '1', '0', '0000-00-00 00:00:00'),
(168, 30, 5, '2006-07-27 21:55:23', '[e]invalid links [t] and [r]', '1', '0', '0000-00-00 00:00:00'),
(169, 24, 5, '2006-07-28 07:45:33', '[quote=seawarrior]welcome everyone to this forum[/quote]\r\nnow i\'ll add a link [link=http://www.google.com]http://www.google.com[/link]', '1', '0', '0000-00-00 00:00:00'),
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
(200, 28, 5, '2006-12-31 20:04:51', 'what\'s all this then? is this john\'s post?', '1', '0', '0000-00-00 00:00:00'),
(201, 28, 5, '2006-12-31 20:21:06', '...hang on, what\'s this one then?\r\n...oh, i get it :)', '1', '0', '0000-00-00 00:00:00'),
(202, 25, 5, '2007-01-01 22:55:17', 'JOHN\'S post', '1', '0', '0000-00-00 00:00:00'),
(203, 25, 5, '2007-01-01 23:18:05', '[quote=Administrator]a bold message too[/quote] checking :)', '1', '0', '0000-00-00 00:00:00'),
(204, 25, 5, '2007-01-11 21:36:36', '&quot;what\'s all this then?&quot; he asked', '1', '0', '0000-00-00 00:00:00'),
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

CREATE TABLE `tblprofessions` (
  `professionID` int(11) NOT NULL,
  `professionName` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `cleanurl` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblquests` (
  `questID` int(11) NOT NULL,
  `journalTitle` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `journalDesc` varchar(255) DEFAULT NULL,
  `questRegion` varchar(128) NOT NULL,
  `isRepeatable` tinyint(1) NOT NULL,
  `childOf` int(11) DEFAULT NULL,
  `startItemsReceived` longtext,
  `itemsNeededForCompletion` longtext,
  `itemsReceivedOnCompletion` longtext CHARACTER SET utf8 COLLATE utf8_bin,
  `whatIsRequiredForCompletion` varchar(128) NOT NULL,
  `titleGainedAfterCompletion` int(11) DEFAULT NULL,
  `thresholdNeededForCompletion` varchar(128) NOT NULL,
  `subQuestsRequiredForCompletion` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblquests`
--

INSERT INTO `tblquests` (`questID`, `journalTitle`, `journalDesc`, `questRegion`, `isRepeatable`, `childOf`, `startItemsReceived`, `itemsNeededForCompletion`, `itemsReceivedOnCompletion`, `whatIsRequiredForCompletion`, `titleGainedAfterCompletion`, `thresholdNeededForCompletion`, `subQuestsRequiredForCompletion`) VALUES
(1, 'Pass the mordant', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '[{\"type\":9,\"colour\":16}]', '[{\"type\":9}]', '[{\"type\":\"19/5\",\"quantity\":6},{\"type\":\"follower\"},{\"type\":\"34\",\"contains\":5},{\"type\":\"29\",\"contains\":3},{\"type\":\"82\",\"contains\":\"##procedural##\"}]', 'give', 4, '', NULL),
(2, 'An unexpected journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '', '', '[{\"type\":9},{\"type\":14},{\"type\":\"$\",\"quantity\":10000}]', 'world', NULL, '', NULL),
(3, 'A longer journey', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 1, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL),
(4, 'A hero\'s peregrination', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '[{\"type\":5},{\"type\":9,\"colour\":16}]', '[{\"type\":19,\"quantity\":5}]', '[{\"type\":9},{\"type\":21,\"quantity\":2}]', 'possess', 7, '', NULL),
(5, 'A much longer task', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '', NULL, '[{\"type\":9},{\"type\":21,\"quantity\":2}]', 'multi', 7, '', '6,7'),
(6, 'sub task 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '', '', '', 'world', NULL, '', NULL),
(7, 'sub task 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '', '', '', 'hero.stats.numberOfcardsFlipped', NULL, '+2', NULL),
(8, 'Win a card game', 'Beat NPC at cards, and got a rare chocobo card', 'Iylan', 0, NULL, '', '0', '[{\"type\":36}]', '', NULL, '', NULL),
(9, 'Find the wizard', 'Locate the wizard', 'Brythillion', 0, NULL, '', '0', '[{\"type\":20}]', '', NULL, '', NULL),
(10, 'Escort to Brythillion', 'Help a traveller find their way to Brythillion.', 'Brythillion', 0, NULL, '', '0', '[{\"type\":20}]', 'escort', NULL, '', NULL),
(11, 'Craft tutorial', 'Craft 5 items. Any items.', 'Brythillion', 0, NULL, '', '0', '[{\"type\":20}]', 'hero.stats.itemsCrafted', NULL, '+5', NULL),
(12, 'Craft linen', 'Craft 3 linen. But make sure it\'s crimson', 'Brythillion', 0, NULL, '', '[{\"type\":14,\"quantity\":3,\"colour\":1}]', '[{\"type\":20}]', 'craft', NULL, '', NULL),
(13, 'Beat all tavern card champions', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque velit in ex ultricies, eget finibus dui vulputate. Aenean lobortis turpis vel tellus iaculis, sit amet accumsan nisl rhoncus. Etiam rhoncus sit amet libero nec bibendum.', 'Iylan', 0, NULL, '', '', '', 'hero.cardBacks', NULL, '[6]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblquestsstatus`
--

CREATE TABLE `tblquestsstatus` (
  `questStatusID` int(11) NOT NULL,
  `charID` int(11) DEFAULT NULL,
  `questID` int(11) DEFAULT NULL,
  `isUnderway` tinyint(1) NOT NULL DEFAULT '0',
  `thresholdAtQuestStart` varchar(255) DEFAULT NULL,
  `hasBeenActivated` tinyint(1) DEFAULT '0',
  `hasBeenCompleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblquestsstatus`
--

INSERT INTO `tblquestsstatus` (`questStatusID`, `charID`, `questID`, `isUnderway`, `thresholdAtQuestStart`, `hasBeenActivated`, `hasBeenCompleted`) VALUES
(1, 0, 0, 0, NULL, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblrecipes`
--

CREATE TABLE `tblrecipes` (
  `recipeID` int(11) NOT NULL,
  `components` longtext,
  `creates` int(11) DEFAULT NULL,
  `hiddenCreates` int(11) DEFAULT NULL,
  `prerequisite` int(11) DEFAULT NULL,
  `profession` int(11) DEFAULT NULL,
  `recipeTier` int(10) NOT NULL,
  `recipeName` varchar(255) DEFAULT NULL,
  `recipeDescription` varchar(255) DEFAULT NULL,
  `defaultResultingColour` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblrecipes`
--

INSERT INTO `tblrecipes` (`recipeID`, `components`, `creates`, `hiddenCreates`, `prerequisite`, `profession`, `recipeTier`, `recipeName`, `recipeDescription`, `defaultResultingColour`) VALUES
(0, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 70\r\n	}\r\n\r\n		},\r\n				{\r\n			\"type\": 2,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n			\"quality\": 70\r\n			}\r\n		}\r\n	]', 12, NULL, 0, 0, 10, NULL, '', 1),
(1, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 70\r\n	}\r\n		},\r\n				{\r\n			\"type\": 3,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n			\"quality\": 70\r\n			}\r\n		}\r\n	]', 12, NULL, 0, 0, 10, NULL, '', 2),
(2, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 70\r\n	}\r\n		},\r\n				{\r\n			\"type\": 5,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n			\"quality\": 70\r\n			}\r\n		}\r\n	]', 12, NULL, 0, 0, 10, NULL, '', 4),
(3, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 70\r\n	}\r\n		},\r\n				{\r\n			\"type\": 24,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n			\"quality\": 70\r\n			}\r\n		}\r\n	]', 7, NULL, 0, 0, 10, NULL, '', NULL),
(4, '[{\r\n			\"type\": 26,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},\r\n		{\r\n			\"type\": 25,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 28, NULL, 0, 0, 0, NULL, '', NULL),
(5, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},\r\n				{\r\n			\"type\": 6,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 12, NULL, 0, 0, 0, NULL, '', 16),
(6, '[{\r\n			\"type\": \"dye\",\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 12, NULL, 0, 0, 0, 'Mix dyes', 'Mix 2 or more dyes to create new colours.', NULL),
(7, '[{\r\n			\"type\": 27,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 26, NULL, 0, 0, 10, 'Burn Wood', 'Produce Wood Ash by burning', NULL),
(8, '[{\r\n			\"type\": \"dye\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},\r\n		{\r\n			\"type\": 14,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 14, 11, 0, 0, 0, 'Dye Linen', 'Colour some linen.', NULL),
(9, '[{\r\n			\"type\": 11,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 0,\r\n		\"durability\": 0,\r\n		\"quality\": 0\r\n	}\r\n		},\r\n		{\r\n			\"type\": \"mrdt\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n		\"effectiveness\": 70\r\n	}\r\n		},\r\n				{\r\n			\"type\": 23,\r\n			\"quantity\": 2,\r\n			\"minQuality\": 0,\r\n			\"influence\": {\r\n			\"quality\": 70\r\n			}\r\n		}\r\n	]', 12, NULL, 0, 0, 0, NULL, '', 6),
(10, '[{\r\n			\"type\": 1,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 14, NULL, 0, 1, 0, NULL, '', NULL),
(11, '[{\r\n			\"type\": 15,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 16, NULL, 0, 1, 0, NULL, '', NULL),
(12, '[{\r\n			\"type\": 37,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},{\r\n			\"type\": 38,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},{\r\n			\"type\": 39,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 40, NULL, 0, 4, 0, NULL, '', 16),
(13, '[{\r\n			\"type\": 15,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 49, NULL, 0, 1, 0, NULL, '', NULL),
(14, '[{\r\n			\"type\": \"dye\",\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		},\r\n		{\r\n			\"type\": 15,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 15, 11, 0, 0, 0, 'Dye Wool', 'Colour some wool.', NULL),
(15, '[{\r\n			\"type\": 14,\r\n			\"quantity\": 1,\r\n			\"minQuality\": 0,\r\n			\"influence\": null\r\n		}\r\n	]', 110, NULL, 0, 2, 10, 'Make paper', 'Create paper from linen', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblregionalpricemodifiers`
--

CREATE TABLE `tblregionalpricemodifiers` (
  `modifierID` int(11) NOT NULL,
  `whichRegion` varchar(128) NOT NULL,
  `itemCategory` int(10) NOT NULL,
  `priceModifier` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblregionalpricemodifiers`
--

INSERT INTO `tblregionalpricemodifiers` (`modifierID`, `whichRegion`, `itemCategory`, `priceModifier`) VALUES
(0, 'Teldrassil', 2, 0.9);

-- --------------------------------------------------------

--
-- Table structure for table `tblregions`
--

CREATE TABLE `tblregions` (
  `regionID` int(11) NOT NULL,
  `regionName` varchar(128) NOT NULL,
  `InWhichcontinent` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblregions`
--

INSERT INTO `tblregions` (`regionID`, `regionName`, `InWhichcontinent`) VALUES
(0, 'Iylan', 'Kalimdor'),
(1, 'Brythillion', 'Kalimdor'),
(2, 'Nottinghamshire', 'Kalimdor'),
(3, 'Cornwall', 'Kalimdor'),
(4, 'Sussex', 'Kalimdor'),
(5, 'Northumbria', 'Kalimdor'),
(6, 'Mercia', 'Kalimdor');

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuefollowers`
--

CREATE TABLE `tblretinuefollowers` (
  `followerID` int(11) NOT NULL,
  `followerName` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `followerCleanURL` varchar(255) COLLATE utf8_bin NOT NULL,
  `characterIdFollowing` int(10) NOT NULL,
  `activeQuestId` int(10) DEFAULT '-1',
  `followerRewardFromQuestId` int(11) DEFAULT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `isHired` tinyint(1) NOT NULL DEFAULT '0',
  `generatedAtTime` datetime NOT NULL,
  `questStartedTime` datetime NOT NULL,
  `followerSex` varchar(6) COLLATE utf8_bin NOT NULL DEFAULT 'female',
  `followerRace` varchar(128) COLLATE utf8_bin NOT NULL,
  `currentContinent` varchar(255) COLLATE utf8_bin NOT NULL,
  `followerMapCoordinateX` int(20) NOT NULL,
  `followerMapCoordinateY` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuefollowers`
--

INSERT INTO `tblretinuefollowers` (`followerID`, `followerName`, `followerCleanURL`, `characterIdFollowing`, `activeQuestId`, `followerRewardFromQuestId`, `isEnabled`, `isHired`, `generatedAtTime`, `questStartedTime`, `followerSex`, `followerRace`, `currentContinent`, `followerMapCoordinateX`, `followerMapCoordinateY`) VALUES
(1, 'Eila Myrborn', 'eila-myrborn', 999, 298, NULL, 1, 0, '0000-00-00 00:00:00', '2019-08-29 21:27:11', 'female', 'huldra', 'eastern-continent', 190, 344),
(2, 'Nellaith Wispfael', 'nellaith-wispfael', 999, -1, NULL, 1, 0, '0000-00-00 00:00:00', '2019-04-03 17:48:34', 'female', 'huldra', 'eastern-continent', 281, 397),
(59, 'Garmund  Wispmote', 'garmund-wispmote', 999, 298, NULL, 1, 0, '0000-00-00 00:00:00', '2019-08-29 21:27:11', 'male', 'huldra', 'eastern-continent', 281, 397),
(67, 'Frith Airsong', 'frith-airsong', 999, -1, NULL, 1, 0, '0000-00-00 00:00:00', '2019-04-02 17:47:09', 'female', 'huldra', 'eastern-continent', 255, 341),
(437, 'Ftrudis  Dewyn', 'ftrudis-dewyn', 999, -1, 1, 0, 0, '2019-04-02 13:29:15', '0000-00-00 00:00:00', 'female', 'huldra', 'eastern-continent', 200, 350),
(439, 'Gladwidu Yewsong', 'gladwidu-yewsong', 999, -1, 0, 1, 1, '2019-04-03 17:31:34', '2019-04-03 17:48:34', 'male', 'huldra', 'eastern-continent', 281, 397),
(440, 'Guthfrith Eldsong', 'guthfrith-eldsong', 999, -1, 0, 1, 1, '2019-04-05 10:38:13', '0000-00-00 00:00:00', 'male', 'huldra', 'eastern-continent', 200, 350),
(447, 'Thild Seresong', 'thild-seresong', 999, -1, 0, 1, 1, '2019-04-25 17:28:07', '0000-00-00 00:00:00', 'female', 'huldra', 'eastern-continent', 200, 350),
(448, 'Thelthryth Goldwyn', 'thelthryth-goldwyn', 998, -1, 1, 0, 0, '2019-08-28 16:52:58', '0000-00-00 00:00:00', 'female', 'huldra', 'eastern-continent', 200, 350),
(449, 'Anflede Feyllon', 'anflede-feyllon', 7, -1, 1, 0, 0, '2019-08-28 16:53:09', '0000-00-00 00:00:00', 'female', 'huldra', 'eastern-continent', 200, 350),
(450, 'Dilburh Seremoss', 'dilburh-seremoss', 1002, -1, 1, 0, 0, '2019-08-28 16:53:15', '0000-00-00 00:00:00', 'female', 'huldra', 'eastern-continent', 200, 350),
(451, 'Gundulf Leyfenna', 'gundulf-leyfenna', 999, -1, 0, 0, 1, '2020-03-27 17:08:18', '0000-00-00 00:00:00', 'male', 'huldra', 'eastern-continent', 200, 350);

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuequests`
--

CREATE TABLE `tblretinuequests` (
  `questID` int(11) NOT NULL,
  `questName` varchar(255) COLLATE utf8_bin NOT NULL,
  `questCleanURL` varchar(255) COLLATE utf8_bin NOT NULL,
  `questDescription` varchar(1024) COLLATE utf8_bin NOT NULL,
  `questType` varchar(128) COLLATE utf8_bin NOT NULL,
  `characterId` int(10) NOT NULL,
  `continent` varchar(255) COLLATE utf8_bin NOT NULL,
  `mapCoordinateX` int(20) NOT NULL,
  `mapCoordinateY` int(20) NOT NULL,
  `needsToReturnToBase` tinyint(1) NOT NULL DEFAULT '0',
  `questDifficulty` int(11) NOT NULL,
  `questObstacles` varchar(128) COLLATE utf8_bin NOT NULL,
  `questCostToStart` varchar(128) COLLATE utf8_bin NOT NULL DEFAULT '0',
  `questPartOfCampaign` int(128) NOT NULL,
  `questNumberOfFollowersRequired` int(10) NOT NULL DEFAULT '1',
  `questNPCMinimumLevel` int(10) NOT NULL DEFAULT '1',
  `questReward` longtext CHARACTER SET latin1 NOT NULL,
  `activeDuringSeason` int(11) DEFAULT NULL,
  `timeCreated` datetime NOT NULL,
  `seed` int(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuequests`
--

INSERT INTO `tblretinuequests` (`questID`, `questName`, `questCleanURL`, `questDescription`, `questType`, `characterId`, `continent`, `mapCoordinateX`, `mapCoordinateY`, `needsToReturnToBase`, `questDifficulty`, `questObstacles`, `questCostToStart`, `questPartOfCampaign`, `questNumberOfFollowersRequired`, `questNPCMinimumLevel`, `questReward`, `activeDuringSeason`, `timeCreated`, `seed`) VALUES
(283, 'Gathering support', 'gathering-support', 'See if you can find people who\'d like to help.', 'recruitment', 999, 'eastern-continent', 277, 278, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:25', 1525950541),
(284, 'Lay of the Land', 'lay-of-the-land', 'Map out the region', 'cartography', 999, 'eastern-continent', 255, 341, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:25', 1525950541),
(285, 'To the rescue', 'to-the-rescue', 'They need your help.', 'rescue', 999, 'eastern-continent', 190, 344, 0, 0, 'sea', '0', 0, 3, 1, '[{\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:25', 1525950541),
(286, 'Climb the ladder', 'climb-the-ladder', 'Compete in a ranked card game tournament.', 'card tournament', 999, 'eastern-continent', 237, 286, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:25', 1525950541),
(287, '-3_1', 'Exploring', 'Exploring', 'Exploring', 999, 'eastern-continent', 152, 282, 1, 0, '', '0', 0, 1, 1, '-3_1', NULL, '2018-05-09 14:03:35', -1),
(288, 'A long descent', 'a-long-descent', 'Enter the depths of blue and face the unknown.', 'dungeon delve', 999, 'eastern-continent', 287, 302, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:37', 1525880045),
(289, 'To the rescue', 'to-the-rescue-2', 'They need your help.', 'rescue', 999, 'eastern-continent', 280, 287, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-09 14:03:42', 1525916827),
(290, '-3_0', 'Exploring', 'Exploring', 'Exploring', 999, 'eastern-continent', 185, 225, 1, 0, '', '0', 0, 1, 1, '-3_0', NULL, '2018-05-09 14:04:15', -1),
(291, '-2_3', 'Exploring', 'Exploring', 'Exploring', 999, 'eastern-continent', 218, 396, 1, 0, '', '0', 0, 1, 1, '-2_3', NULL, '2018-05-09 14:04:20', -1),
(292, 'Get yer boots on', 'get-yer-boots-on', 'There\'s plenty of salvage to be had in the sea.', 'salvage', 999, 'eastern-continent', 136, 310, 0, 0, 'sea', '0', 0, 3, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-16 12:34:23', 1526497502),
(293, 'Devoting some time', 'devoting-some-time', 'A journey of reverence.', 'pilgrimage', 999, 'eastern-continent', 214, 393, 0, 0, '', '0', 0, 3, 1, '[{\"type\":2,\"quantity\":1,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-16 12:34:26', 1526548337),
(294, 'Showing the way', 'showing-the-way', 'Ensure orange is reached safely.', 'escort', 999, 'eastern-continent', 189, 231, 0, 0, '', '0', 0, 1, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-16 12:34:28', 1526511018),
(295, '-1_3', 'Exploring', 'Exploring', 'Exploring', 999, 'eastern-continent', 284, 396, 1, 0, '', '0', 0, 1, 1, '-1_3', NULL, '2018-05-16 12:40:43', -1),
(296, 'Bring home the goods', 'bring-home-the-goods', 'Gather what kelp you can.', 'resource gathering', 999, 'eastern-continent', 281, 397, 0, 0, 'sea', '0', 0, 3, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-05-16 12:41:08', 1526507286),
(297, '-1_2', 'Exploring', 'Exploring', 'Exploring', 999, 'eastern-continent', 317, 339, 1, 0, '', '0', 0, 1, 1, '-1_2', NULL, '2018-08-20 10:37:58', -1),
(298, 'To the rescue', 'to-the-rescue-3', 'Grey is in need. Get over there and help.', 'rescue', 999, 'eastern-continent', 346, 341, 0, 0, '', '0', 0, 2, 1, '[{\"type\":2,\"quantity\":3,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2018-10-18 21:51:34', 1539971148),
(299, 'To the rescue', 'to-the-rescue-4', 'They need your help.', 'rescue', 999, 'eastern-continent', 279, 298, 0, 0, '', '0', 0, 3, 1, '[{\"type\":2,\"quantity\":2,\"quality\":100,\"durability\":100,\"currentWear\":0,\"effectiveness\":100,\"colour\":\"0\",\"enchanted\":0,\"hallmark\":0,\"inscription\":\"\"}]', NULL, '2019-08-29 21:27:16', 1567153730);

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuequestsactive`
--

CREATE TABLE `tblretinuequestsactive` (
  `questActiveId` int(11) NOT NULL,
  `questIdActiveOrComplete` int(10) NOT NULL,
  `characterId` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuequestsactive`
--

INSERT INTO `tblretinuequestsactive` (`questActiveId`, `questIdActiveOrComplete`, `characterId`) VALUES
(1, 1, 999),
(3, 2, 999),
(4, 98, 999),
(5, 99, 999),
(6, 100, 999),
(7, 101, 999),
(8, 102, 999),
(9, 103, 999),
(10, 105, 999),
(11, 104, 999),
(12, 113, 999),
(13, 111, 999),
(14, 110, 999),
(15, 109, 999),
(16, 112, 999),
(17, 114, 999),
(18, 106, 999),
(19, 107, 999),
(20, 118, 999),
(21, 120, 999),
(22, 123, 999),
(23, 127, 999),
(24, 124, 999),
(25, 125, 999),
(26, 122, 999),
(27, 126, 999),
(28, 128, 999),
(29, 121, 999),
(30, 119, 999),
(31, 115, 999),
(32, 117, 999),
(33, 130, 999),
(34, 132, 999),
(35, 138, 999),
(36, 133, 999),
(37, 116, 999),
(38, 136, 999),
(39, 134, 999),
(40, 152, 999),
(41, 153, 999),
(42, 149, 999),
(43, 154, 999),
(44, 151, 999),
(45, 166, 999),
(46, 167, 999),
(47, 164, 999),
(48, 160, 999),
(49, 169, 999),
(50, 170, 999),
(51, 171, 999),
(52, 172, 999),
(53, 173, 999),
(54, 176, 999),
(55, 178, 999),
(56, 180, 999),
(57, 181, 999),
(58, 184, 999),
(59, 192, 999),
(60, 190, 999),
(61, 216, 999),
(62, 217, 999),
(63, 242, 999),
(64, 253, 999),
(65, 259, 999),
(66, 263, 999),
(67, 262, 999),
(68, 271, 999),
(69, 268, 999),
(70, 0, 999),
(71, 0, 999),
(72, 0, 999),
(73, 0, 999),
(74, 0, 999),
(75, 0, 999),
(76, 273, 999),
(77, 274, 999),
(78, 275, 999),
(79, 0, 999),
(80, 276, 999),
(81, 277, 999),
(82, 278, 999),
(83, 0, 999),
(84, 279, 999),
(85, 280, 999),
(86, 281, 999),
(87, 287, 999),
(88, 290, 999),
(89, 291, 999),
(90, 295, 999),
(91, 297, 999),
(92, 285, 999),
(93, 284, 999),
(94, 286, 999),
(95, 288, 999),
(96, 296, 999),
(97, 298, 999);

-- --------------------------------------------------------

--
-- Table structure for table `tblretinuequesttypes`
--

CREATE TABLE `tblretinuequesttypes` (
  `questTypeID` int(11) NOT NULL,
  `questTypeName` varchar(255) COLLATE utf8_bin NOT NULL,
  `questTypeBaseTitleGrammar` mediumtext COLLATE utf8_bin NOT NULL,
  `questTypeBaseGrammar` longtext COLLATE utf8_bin NOT NULL,
  `suitableFor` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tblretinuequesttypes`
--

INSERT INTO `tblretinuequesttypes` (`questTypeID`, `questTypeName`, `questTypeBaseTitleGrammar`, `questTypeBaseGrammar`, `suitableFor`) VALUES
(1, 'cartography', 'Lay of the Land|Mapping the wilds', 'Map out as much of ++region++ as you can.|Map out the region', 'land,sea,isle'),
(2, 'card game', 'Play your best hand', 'Be the best at cards.', 'land, isle'),
(3, 'card tournament', 'Climb the ladder', 'Compete in a ranked card game tournament.', 'land,isle'),
(5, 'salvage', 'Get yer boots on', 'There\'s plenty of salvage to be had in ++region++.', 'sea,isle'),
(6, 'rescue', 'To the rescue|Lend a hand', 'They need your help.|++region++ is in need. Get over there and help.', 'land,sea,isle'),
(7, 'delivery', 'Knock, knock', 'The post isn\'t fast enough for this. Make haste.', 'land,isle'),
(8, 'escort', 'Showing the way', 'Ensure ++region++ is reached safely.', 'land,isle'),
(9, 'construction', 'Laying the foundations', 'Build up, strengthen and expand.', 'land,isle'),
(10, 'dungeon delve', 'A long descent', 'Enter the depths of ++region++ and face the unknown.', 'land,isle'),
(11, 'crafting', 'Glue and thread', 'Make exquisite items.', 'land,isle'),
(12, 'travelling fair', 'All the fun of the fair', 'Enjoy yourself for a while.', 'land,isle'),
(13, 'pilgrimage', 'Devoting some time', 'A journey of reverence.', 'land,isle'),
(14, 'merchant caravan', 'Across the plains...', 'Large scale trade across vast distances.', 'land,isle'),
(15, 'diplomacy', 'Offering hope', 'Future treaties are in your hands.', 'land,isle'),
(16, 'resource gathering', 'Bring home the goods', 'Gather what ++resource++ you can.', 'land,isle,sea'),
(17, 'recruitment', 'Gathering support', 'See if you can find people who\'d like to help.', 'land,isle,sea');

-- --------------------------------------------------------

--
-- Table structure for table `tblsavedsearches`
--

CREATE TABLE `tblsavedsearches` (
  `searchID` int(11) NOT NULL,
  `searchTerm` varchar(255) DEFAULT NULL,
  `searchCount` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
(46, 'dragon', 352),
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

CREATE TABLE `tblsubscribedthreads` (
  `subthreadID` int(11) NOT NULL,
  `accountID` int(11) DEFAULT NULL,
  `threadID` int(11) DEFAULT NULL,
  `status` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tblthreads` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

CREATE TABLE `tbltitles` (
  `titleID` int(11) NOT NULL,
  `titleName` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  ADD PRIMARY KEY (`accountID`),
  ADD UNIQUE KEY `accountName` (`accountName`);

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
-- Indexes for table `tblcardbacks`
--
ALTER TABLE `tblcardbacks`
  ADD PRIMARY KEY (`cardBackID`);

--
-- Indexes for table `tblcards`
--
ALTER TABLE `tblcards`
  ADD PRIMARY KEY (`cardID`);

--
-- Indexes for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  ADD PRIMARY KEY (`charID`),
  ADD UNIQUE KEY `cleanURL` (`cleanURL`),
  ADD UNIQUE KEY `charName` (`charName`);

--
-- Indexes for table `tblcollectionquests`
--
ALTER TABLE `tblcollectionquests`
  ADD PRIMARY KEY (`collectionQuestID`),
  ADD UNIQUE KEY `cleanurl` (`cleanurl`);

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
  ADD PRIMARY KEY (`creatureID`),
  ADD KEY `creatureType` (`creatureType`);

--
-- Indexes for table `tblcreaturetypes`
--
ALTER TABLE `tblcreaturetypes`
  ADD PRIMARY KEY (`creatureTypeId`),
  ADD UNIQUE KEY `creatureTypeName` (`creatureTypeName`);

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
  ADD PRIMARY KEY (`friendlistID`),
  ADD UNIQUE KEY `friendlistID` (`friendlistID`);

--
-- Indexes for table `tblguildmembers`
--
ALTER TABLE `tblguildmembers`
  ADD PRIMARY KEY (`guildMemberID`);

--
-- Indexes for table `tblguilds`
--
ALTER TABLE `tblguilds`
  ADD UNIQUE KEY `guildID` (`guildID`),
  ADD UNIQUE KEY `guildName` (`guildName`);

--
-- Indexes for table `tblinventoryitems`
--
ALTER TABLE `tblinventoryitems`
  ADD PRIMARY KEY (`itemID`),
  ADD KEY `itemGroup` (`itemGroup`);

--
-- Indexes for table `tblitemcategories`
--
ALTER TABLE `tblitemcategories`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `tblitemgroups`
--
ALTER TABLE `tblitemgroups`
  ADD PRIMARY KEY (`itemGroupID`),
  ADD UNIQUE KEY `itemGroupCode` (`itemGroupCode`);

--
-- Indexes for table `tbllocations`
--
ALTER TABLE `tbllocations`
  ADD PRIMARY KEY (`locID`),
  ADD UNIQUE KEY `locID` (`locID`),
  ADD KEY `locID_2` (`locID`);

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
-- Indexes for table `tblpantheon`
--
ALTER TABLE `tblpantheon`
  ADD PRIMARY KEY (`godID`),
  ADD UNIQUE KEY `regionName` (`godName`);

--
-- Indexes for table `tblplants`
--
ALTER TABLE `tblplants`
  ADD PRIMARY KEY (`plantID`);

--
-- Indexes for table `tblplayergeneratedcontent`
--
ALTER TABLE `tblplayergeneratedcontent`
  ADD PRIMARY KEY (`itemID`);

--
-- Indexes for table `tblplayerhousing`
--
ALTER TABLE `tblplayerhousing`
  ADD PRIMARY KEY (`mapHousingID`);

--
-- Indexes for table `tblposts`
--
ALTER TABLE `tblposts`
  ADD PRIMARY KEY (`postID`);

--
-- Indexes for table `tblprofessions`
--
ALTER TABLE `tblprofessions`
  ADD PRIMARY KEY (`professionID`),
  ADD UNIQUE KEY `professionName` (`professionName`);

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
-- Indexes for table `tblregionalpricemodifiers`
--
ALTER TABLE `tblregionalpricemodifiers`
  ADD PRIMARY KEY (`modifierID`);

--
-- Indexes for table `tblregions`
--
ALTER TABLE `tblregions`
  ADD PRIMARY KEY (`regionID`),
  ADD UNIQUE KEY `regionName` (`regionName`);

--
-- Indexes for table `tblretinuefollowers`
--
ALTER TABLE `tblretinuefollowers`
  ADD PRIMARY KEY (`followerID`);

--
-- Indexes for table `tblretinuequests`
--
ALTER TABLE `tblretinuequests`
  ADD PRIMARY KEY (`questID`);

--
-- Indexes for table `tblretinuequestsactive`
--
ALTER TABLE `tblretinuequestsactive`
  ADD PRIMARY KEY (`questActiveId`);

--
-- Indexes for table `tblretinuequesttypes`
--
ALTER TABLE `tblretinuequesttypes`
  ADD PRIMARY KEY (`questTypeID`),
  ADD UNIQUE KEY `questTypeName` (`questTypeName`);

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
  MODIFY `accountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `tblauctionbids`
--
ALTER TABLE `tblauctionbids`
  MODIFY `bidID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tblauctionitems`
--
ALTER TABLE `tblauctionitems`
  MODIFY `auctionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tblcardbacks`
--
ALTER TABLE `tblcardbacks`
  MODIFY `cardBackID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tblcards`
--
ALTER TABLE `tblcards`
  MODIFY `cardID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tblcharacters`
--
ALTER TABLE `tblcharacters`
  MODIFY `charID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1003;

--
-- AUTO_INCREMENT for table `tblcollectionquests`
--
ALTER TABLE `tblcollectionquests`
  MODIFY `collectionQuestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblcolours`
--
ALTER TABLE `tblcolours`
  MODIFY `colourID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tblcontractbids`
--
ALTER TABLE `tblcontractbids`
  MODIFY `bidID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tblcontracts`
--
ALTER TABLE `tblcontracts`
  MODIFY `contractID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblcreatures`
--
ALTER TABLE `tblcreatures`
  MODIFY `creatureID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tblcreaturetypes`
--
ALTER TABLE `tblcreaturetypes`
  MODIFY `creatureTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbldungeonachievements`
--
ALTER TABLE `tbldungeonachievements`
  MODIFY `index` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbldungeonmapconfig`
--
ALTER TABLE `tbldungeonmapconfig`
  MODIFY `dungeonId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblevents`
--
ALTER TABLE `tblevents`
  MODIFY `eventID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tblforums`
--
ALTER TABLE `tblforums`
  MODIFY `forumID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblfreeformpages`
--
ALTER TABLE `tblfreeformpages`
  MODIFY `pageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblfriendlist`
--
ALTER TABLE `tblfriendlist`
  MODIFY `friendlistID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblguildmembers`
--
ALTER TABLE `tblguildmembers`
  MODIFY `guildMemberID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblguilds`
--
ALTER TABLE `tblguilds`
  MODIFY `guildID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblinventoryitems`
--
ALTER TABLE `tblinventoryitems`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `tblitemcategories`
--
ALTER TABLE `tblitemcategories`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tblitemgroups`
--
ALTER TABLE `tblitemgroups`
  MODIFY `itemGroupID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbllocations`
--
ALTER TABLE `tbllocations`
  MODIFY `locID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tblmail`
--
ALTER TABLE `tblmail`
  MODIFY `mailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=953;

--
-- AUTO_INCREMENT for table `tblmainpoll`
--
ALTER TABLE `tblmainpoll`
  MODIFY `pollID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblmainpollchoices`
--
ALTER TABLE `tblmainpollchoices`
  MODIFY `choiceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblnews`
--
ALTER TABLE `tblnews`
  MODIFY `newsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tblpantheon`
--
ALTER TABLE `tblpantheon`
  MODIFY `godID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblplants`
--
ALTER TABLE `tblplants`
  MODIFY `plantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=602;

--
-- AUTO_INCREMENT for table `tblplayergeneratedcontent`
--
ALTER TABLE `tblplayergeneratedcontent`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblplayerhousing`
--
ALTER TABLE `tblplayerhousing`
  MODIFY `mapHousingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `tblposts`
--
ALTER TABLE `tblposts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `tblprofessions`
--
ALTER TABLE `tblprofessions`
  MODIFY `professionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tblquests`
--
ALTER TABLE `tblquests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tblquestsstatus`
--
ALTER TABLE `tblquestsstatus`
  MODIFY `questStatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblrecipes`
--
ALTER TABLE `tblrecipes`
  MODIFY `recipeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tblregionalpricemodifiers`
--
ALTER TABLE `tblregionalpricemodifiers`
  MODIFY `modifierID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tblregions`
--
ALTER TABLE `tblregions`
  MODIFY `regionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tblretinuefollowers`
--
ALTER TABLE `tblretinuefollowers`
  MODIFY `followerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=452;

--
-- AUTO_INCREMENT for table `tblretinuequests`
--
ALTER TABLE `tblretinuequests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=300;

--
-- AUTO_INCREMENT for table `tblretinuequestsactive`
--
ALTER TABLE `tblretinuequestsactive`
  MODIFY `questActiveId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `tblretinuequesttypes`
--
ALTER TABLE `tblretinuequesttypes`
  MODIFY `questTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tblsavedsearches`
--
ALTER TABLE `tblsavedsearches`
  MODIFY `searchID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `tblsubscribedthreads`
--
ALTER TABLE `tblsubscribedthreads`
  MODIFY `subthreadID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `tblthreads`
--
ALTER TABLE `tblthreads`
  MODIFY `threadID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tbltitles`
--
ALTER TABLE `tbltitles`
  MODIFY `titleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblcreatures`
--
ALTER TABLE `tblcreatures`
  ADD CONSTRAINT `tblcreatures_ibfk_1` FOREIGN KEY (`creatureType`) REFERENCES `tblcreaturetypes` (`creatureTypeName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
