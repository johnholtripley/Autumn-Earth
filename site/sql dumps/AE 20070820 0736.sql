-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	4.1.7-nt-log


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema autumnearth
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ autumnearth;
USE autumnearth;

--
-- Table structure for table `autumnearth`.`tblacct`
--

DROP TABLE IF EXISTS `tblacct`;
CREATE TABLE `tblacct` (
  `accountID` int(11) NOT NULL auto_increment,
  `accountName` varchar(25) default NULL,
  `accountStatus` char(1) default NULL,
  `joinedTime` datetime default NULL,
  `accountType` char(1) default NULL,
  `postCount` int(11) default NULL,
  `currentCharID` char(1) default NULL,
  `email` varchar(255) default NULL,
  `birthday` datetime default NULL,
  `subscribeNews` char(1) default NULL,
  `subscribeUpdates` char(1) default NULL,
  `password` varchar(255) default NULL,
  `signature` varchar(255) default NULL,
  `htmlemail` char(1) default NULL,
  `emailalerts` char(1) default NULL,
  `uniqueID` varchar(255) default NULL,
  `usersIPAddress` varchar(15) default NULL,
  PRIMARY KEY  (`accountID`),
  UNIQUE KEY `accountName` (`accountName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblacct`
--

/*!40000 ALTER TABLE `tblacct` DISABLE KEYS */;
INSERT INTO `tblacct` (`accountID`,`accountName`,`accountStatus`,`joinedTime`,`accountType`,`postCount`,`currentCharID`,`email`,`birthday`,`subscribeNews`,`subscribeUpdates`,`password`,`signature`,`htmlemail`,`emailalerts`,`uniqueID`,`usersIPAddress`) VALUES 
 (5,'seawarrior','2','2006-07-06 21:49:41','0',89,'1','john@salmacis.co.uk','2006-07-29 18:16:14','1','1','ý¨âù­D;ùÉ“>hpTéÛ','[u]warrior[/u] from the sea :)','1','1','49a3805132045cc65b4b5ab43568fd2f',NULL),
 (13,'Administrator','2','2006-07-08 11:59:34','2',55,'5','john@salmacis.co.uk','1974-12-24 00:00:00','1','1','w·J.>JguZE˜pw','admin signature','1','1','c91c757f11984bffdaa8e134a02670d1',NULL),
 (14,'Moderator','2','2006-07-08 12:00:21','1',16,'7','john@salmacis.co.uk','2006-01-01 00:00:00','1','1','“^º«—‘î…ƒ‚Xß¹)/','mod signature','1','1','e62499bfb61e356017ad99fc2d29eb65',NULL),
 (15,'john','2','2006-07-08 12:05:35','0',0,'1','john@salmacis.co.uk','2006-01-01 00:00:00','1','1','´ÉQÓ¾b@Ü¡¨w¦’,I','curiouser and curiouser','1','1','03a94b7efb020da1caa0c5766c5b55bd',NULL),
 (18,'newmember','2','2006-07-13 07:44:14','0',7,'1','john@salmacis.co.uk','1990-07-05 00:00:00','1','1','xb{lú`r^×>ë?îC','10 people understand binary','1','1','a8a5b0f52af29a6b828f72201d63dda7',NULL);
INSERT INTO `tblacct` (`accountID`,`accountName`,`accountStatus`,`joinedTime`,`accountType`,`postCount`,`currentCharID`,`email`,`birthday`,`subscribeNews`,`subscribeUpdates`,`password`,`signature`,`htmlemail`,`emailalerts`,`uniqueID`,`usersIPAddress`) VALUES 
 (23,'Stanley','2','2006-07-31 21:13:43','0',0,'4','john@salmacis.co.uk','2001-08-15 00:00:00','0','1','¾$Ð`ßðŠ‰Ò(!e','king of sleeping','1','1','26fe209ceeaa3a61f55bfe79c45de96f',NULL),
 (24,'Angel','2','2006-07-31 22:33:33','0',0,'1','john@salmacis.co.uk','2006-01-01 00:00:00','1','1','9±(¸Áò©ŒR‚ð»\rÞ','------','0','1','6b4919695daf5c7f66601ff24b5310ed',NULL),
 (25,'****wit','2','2006-08-07 22:35:16','0',0,'1','john@salmacis.co.uk','2006-01-01 00:00:00','1','1','!:Z¸Q4ÍNVÈ’4$F','i tried... :(','0','1','384d845fa6a1f05c120c62bbd5f3582e',NULL),
 (26,'Belial','2','2006-09-04 02:56:58','0',0,'','chris@canyonlaketexs.us','2006-01-01 00:00:00','0','0','l\ZîÝØ J_ð£«¯eºã','Christophe Belial','1','0','fbb77bcb7cb9e25afa3cbd7e78ca9607',NULL),
 (27,'email checker','2','2007-02-21 08:47:34','0',0,'1','john@salmacis.co.uk','2007-01-01 00:00:00','1','1','‰Ž.>yÖ	’½9³W-’','','1','1','fb3507f2f13101f846fa798313702ac3',NULL);
INSERT INTO `tblacct` (`accountID`,`accountName`,`accountStatus`,`joinedTime`,`accountType`,`postCount`,`currentCharID`,`email`,`birthday`,`subscribeNews`,`subscribeUpdates`,`password`,`signature`,`htmlemail`,`emailalerts`,`uniqueID`,`usersIPAddress`) VALUES 
 (28,'testingIP','2','2007-05-09 12:13:30','0',0,'1','john@metafocus.co.uk','2007-07-01 00:00:00','1','1','*-¥÷*±\Zï`L!ï6','----','1','1','20fb6d0cb57fc10c5c1df41ed85a71d8','212.135.231.210'),
 (29,'Vasco','2','2007-06-22 17:28:05','0',0,'1','vasco3@home.nl','1988-01-06 00:00:00','0','0','•Lylr¯ã‘rywaË§','Vasco','1','0','7a7a1ff108e1bdedc0edf31834a6ecdc','82.93.228.227'),
 (30,'sheep','2','2007-07-21 15:35:16','0',0,'3','john@salmacis.co.uk','2007-01-01 00:00:00','1','1','œŠhº€Ív£?iõšú‹ë','---','1','1','51277f189c5d244c2749d1915b28b80a','88.104.225.176'),
 (31,'testingip#2','2','2007-07-23 18:23:22','0',0,'1','john@wibble.com','2007-01-01 00:00:00','1','1','f,cÖÔ}<ÝÈz~aúdu','','1','1','497603502b525059ae6b201a7e86b2d0','88.104.225.176');
/*!40000 ALTER TABLE `tblacct` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblauctionbids`
--

DROP TABLE IF EXISTS `tblauctionbids`;
CREATE TABLE `tblauctionbids` (
  `bidID` int(11) NOT NULL auto_increment,
  `auctionID` int(11) default NULL,
  `bidderID` int(11) default NULL,
  `bidAmount` int(11) default NULL,
  PRIMARY KEY  (`bidID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblauctionbids`
--

/*!40000 ALTER TABLE `tblauctionbids` DISABLE KEYS */;
INSERT INTO `tblauctionbids` (`bidID`,`auctionID`,`bidderID`,`bidAmount`) VALUES 
 (1,4,13,6),
 (2,4,12,16),
 (3,4,8,24),
 (4,4,13,154),
 (5,4,13,230),
 (6,4,7,2300),
 (7,4,7,240),
 (8,4,7,600),
 (9,4,7,2500),
 (10,4,5,3000),
 (11,4,5,3500),
 (12,4,4,5000),
 (13,4,4,7000),
 (14,4,4,7200),
 (15,4,4,7800),
 (16,4,4,8400),
 (17,4,4,9000),
 (18,4,4,12003),
 (19,4,4,14507),
 (20,1,1,100);
/*!40000 ALTER TABLE `tblauctionbids` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblauctionitems`
--

DROP TABLE IF EXISTS `tblauctionitems`;
CREATE TABLE `tblauctionitems` (
  `auctionID` int(11) NOT NULL auto_increment,
  `startTime` datetime default NULL,
  `endTime` datetime default NULL,
  `sellerID` int(11) default NULL,
  `itemID` int(11) default NULL,
  `quantity` int(11) default NULL,
  `buyItNowPrice` int(11) default NULL,
  `reservePrice` int(11) default NULL,
  `startPrice` int(11) default NULL,
  `auctionClosed` tinyint(1) default NULL,
  PRIMARY KEY  (`auctionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblauctionitems`
--

/*!40000 ALTER TABLE `tblauctionitems` DISABLE KEYS */;
INSERT INTO `tblauctionitems` (`auctionID`,`startTime`,`endTime`,`sellerID`,`itemID`,`quantity`,`buyItNowPrice`,`reservePrice`,`startPrice`,`auctionClosed`) VALUES 
 (1,'2007-10-18 21:08:58','2007-10-28 21:08:58',13,6,4,-1,-1,20,0),
 (2,'2007-10-18 21:08:58','2007-10-28 21:08:58',5,24,10,100,-1,20,0),
 (3,'2007-10-18 21:08:58','2007-10-28 21:08:58',13,24,2,-1,45,20,0),
 (4,'2007-10-18 21:08:58','2007-10-28 21:08:58',2,2,10,-1,-1,20,0),
 (5,'2007-10-18 21:08:58','2007-10-28 21:08:58',5,6,1,10,-1,20,0),
 (6,'2007-10-18 21:08:58','2007-10-28 21:08:58',13,13,6,-1,-1,20,0),
 (7,'2007-10-18 21:08:58','2007-10-28 21:08:58',13,13,6,-1,-1,20,0),
 (8,'2007-10-18 21:08:58','2007-10-28 21:08:58',13,6,4,-1,-1,20,0);
/*!40000 ALTER TABLE `tblauctionitems` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblcharacters`
--

DROP TABLE IF EXISTS `tblcharacters`;
CREATE TABLE `tblcharacters` (
  `charID` int(11) NOT NULL auto_increment,
  `accountID` int(11) default NULL,
  `charName` varchar(25) default NULL,
  `location` varchar(50) default NULL,
  `gamestate` longtext,
  `journalstate` longtext,
  `queststate` longtext,
  `petstate` longtext,
  `currentbag` varchar(4) default NULL,
  `inventorystate` longtext,
  `money` varchar(12) default NULL,
  `house` int(11) NOT NULL default '0',
  `minutesplayed` int(11) unsigned default NULL,
  `guildID` int(11) default '0',
  `guildmembersince` date default NULL,
  PRIMARY KEY  (`charID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblcharacters`
--

/*!40000 ALTER TABLE `tblcharacters` DISABLE KEYS */;
INSERT INTO `tblcharacters` (`charID`,`accountID`,`charName`,`location`,`gamestate`,`journalstate`,`queststate`,`petstate`,`currentbag`,`inventorystate`,`money`,`house`,`minutesplayed`,`guildID`,`guildmembersince`) VALUES 
 (1,5,'Angel','Sundown Hills','&amp;playsounds=true&amp;herox=23&amp;heroy=9&amp;dowseskill=0&amp;famskill=70&amp;currentmapnumber=1&amp;heightgained=0','travel to the coast','0/0/0/0/0/0','2,0,100,24,7,-1,0,0,0,0,pet,15,12,13','16','32,4/2,8/9,1/1,2/10,3/33,1','299',0,1125,0,'2007-03-30'),
 (2,5,'Eleaddai','Stormwind',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (3,5,'Alice','Dustirnne',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (4,23,'Eric','Crown Valley',NULL,NULL,NULL,NULL,NULL,NULL,'501',0,200,0,'2007-03-30'),
 (5,13,'Adminchar1','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,'0',0,200,0,'2007-03-30'),
 (6,13,'Adminchar2','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,'20',0,200,0,'2007-03-30'),
 (7,14,'modchar1','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (8,14,'modchar2','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30');
INSERT INTO `tblcharacters` (`charID`,`accountID`,`charName`,`location`,`gamestate`,`journalstate`,`queststate`,`petstate`,`currentbag`,`inventorystate`,`money`,`house`,`minutesplayed`,`guildID`,`guildmembersince`) VALUES 
 (9,15,'johnchar1','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (10,18,'newmemberchar1','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (11,18,'newmemberchar2','Sundown Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (12,13,'Angel','Sunduun Hills',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30'),
 (13,14,'Angel','Somewhere else',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,0,'2007-03-30');
/*!40000 ALTER TABLE `tblcharacters` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblevents`
--

DROP TABLE IF EXISTS `tblevents`;
CREATE TABLE `tblevents` (
  `eventID` int(11) NOT NULL auto_increment,
  `eventStart` datetime default NULL,
  `eventEnd` datetime default NULL,
  `tooltip` varchar(255) default NULL,
  `css` varchar(25) default NULL,
  `link` varchar(255) default NULL,
  PRIMARY KEY  (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblevents`
--

/*!40000 ALTER TABLE `tblevents` DISABLE KEYS */;
INSERT INTO `tblevents` (`eventID`,`eventStart`,`eventEnd`,`tooltip`,`css`,`link`) VALUES 
 (1,'2006-08-27 00:00:00','2006-09-01 00:00:00','halloween events part4','CHalloween','/events/index.php#4'),
 (2,'2006-08-03 00:00:00','2006-08-08 00:00:00','halloween events part1','CHalloween','/events/index.php#1'),
 (3,'2006-08-12 00:00:00','2006-08-12 00:00:00','halloween events part2','CHalloween','/events/index.php#2'),
 (4,'2006-07-12 00:00:00','2006-08-01 00:00:00','halloween events part3','CHalloween','/events/index.php#3'),
 (5,'2006-12-25 00:00:00','2006-12-25 00:00:00','Christmas','CHalloween','/events/index.php#5');
/*!40000 ALTER TABLE `tblevents` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblforums`
--

DROP TABLE IF EXISTS `tblforums`;
CREATE TABLE `tblforums` (
  `forumID` int(11) NOT NULL auto_increment,
  `title` varchar(255) default NULL,
  `description` mediumtext,
  `imagePath` varchar(255) default NULL,
  `status` char(1) default NULL,
  `sticky` char(1) default NULL,
  PRIMARY KEY  (`forumID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblforums`
--

/*!40000 ALTER TABLE `tblforums` DISABLE KEYS */;
INSERT INTO `tblforums` (`forumID`,`title`,`description`,`imagePath`,`status`,`sticky`) VALUES 
 (1,'Bug Reports','Found a bug? Let us know about it here.','/assets/forum/bugforum.gif','2','1'),
 (2,'Suggestions','Thought of an improvement? Let us know what features you\'d like to see in the next update.','/assets/forum/suggestforum.gif','2','1'),
 (3,'General Discussion','Want to meet other players? find and chat to them here.','/assets/forum/generalforum.gif','2','1');
/*!40000 ALTER TABLE `tblforums` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblfreeformpages`
--

DROP TABLE IF EXISTS `tblfreeformpages`;
CREATE TABLE `tblfreeformpages` (
  `pageID` int(11) NOT NULL auto_increment,
  `status` char(1) default NULL,
  `pageContent` longtext,
  `textColour` varchar(6) default '000000',
  `bgColour` varchar(6) default 'ffffff',
  `freeformPageTitle` varchar(255) default NULL,
  `guildID` int(11) default NULL,
  `public` char(1) default '1',
  `fontfamily` varchar(255) default NULL,
  PRIMARY KEY  (`pageID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblfreeformpages`
--

/*!40000 ALTER TABLE `tblfreeformpages` DISABLE KEYS */;
INSERT INTO `tblfreeformpages` (`pageID`,`status`,`pageContent`,`textColour`,`bgColour`,`freeformPageTitle`,`guildID`,`public`,`fontfamily`) VALUES 
 (1,'1','&lt;P&gt;stuff&lt;/P&gt;\r\n&lt;P&gt;more stuff&lt;/P&gt;\r\n&lt;P style=&quot;TEXT-ALIGN: left&quot;&gt;and &lt;STRONG&gt;a bit more&lt;/STRONG&gt; stuff &lt;/P&gt;\r\n&lt;P&gt;and this&lt;/P&gt;','CCCCCC','330000','guild page #1',1,'0','Georgia, \'Times New Roman\', Times, serif');
/*!40000 ALTER TABLE `tblfreeformpages` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblfriendlist`
--

DROP TABLE IF EXISTS `tblfriendlist`;
CREATE TABLE `tblfriendlist` (
  `friendlistID` int(11) NOT NULL auto_increment,
  `characterID` int(11) default NULL,
  `friendID` int(11) default NULL,
  PRIMARY KEY  (`friendlistID`),
  UNIQUE KEY `friendlistID` (`friendlistID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblfriendlist`
--

/*!40000 ALTER TABLE `tblfriendlist` DISABLE KEYS */;
INSERT INTO `tblfriendlist` (`friendlistID`,`characterID`,`friendID`) VALUES 
 (1,5,6),
 (2,7,8);
/*!40000 ALTER TABLE `tblfriendlist` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblguildmembers`
--

DROP TABLE IF EXISTS `tblguildmembers`;
CREATE TABLE `tblguildmembers` (
  `guildMemberID` int(11) NOT NULL auto_increment,
  `guildID` int(11) default NULL,
  `charID` int(11) default NULL,
  PRIMARY KEY  (`guildMemberID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblguildmembers`
--

/*!40000 ALTER TABLE `tblguildmembers` DISABLE KEYS */;
INSERT INTO `tblguildmembers` (`guildMemberID`,`guildID`,`charID`) VALUES 
 (1,1,1);
/*!40000 ALTER TABLE `tblguildmembers` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblguilds`
--

DROP TABLE IF EXISTS `tblguilds`;
CREATE TABLE `tblguilds` (
  `guildID` int(11) NOT NULL auto_increment,
  `guildName` varchar(255) default NULL,
  `createdTime` datetime default NULL,
  UNIQUE KEY `guildID` (`guildID`),
  UNIQUE KEY `guildName` (`guildName`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblguilds`
--

/*!40000 ALTER TABLE `tblguilds` DISABLE KEYS */;
INSERT INTO `tblguilds` (`guildID`,`guildName`,`createdTime`) VALUES 
 (1,'The Caped Crusaders','2007-07-21 15:39:45'),
 (2,'EarthenRing','2007-07-21 15:39:45');
/*!40000 ALTER TABLE `tblguilds` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblinventoryitems`
--

DROP TABLE IF EXISTS `tblinventoryitems`;
CREATE TABLE `tblinventoryitems` (
  `itemID` int(11) NOT NULL auto_increment,
  `shortname` varchar(50) default NULL,
  `description` varchar(255) default NULL,
  `priceCode` varchar(12) default NULL,
  `tilex` decimal(11,1) default NULL,
  `tiley` decimal(11,1) default NULL,
  `worldGraphic` int(11) default NULL,
  `requirements` varchar(50) default NULL,
  `itemType` int(11) default NULL,
  PRIMARY KEY  (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblinventoryitems`
--

/*!40000 ALTER TABLE `tblinventoryitems` DISABLE KEYS */;
INSERT INTO `tblinventoryitems` (`itemID`,`shortname`,`description`,`priceCode`,`tilex`,`tiley`,`worldGraphic`,`requirements`,`itemType`) VALUES 
 (1,'Empty Slot','-','-','0.5','0.5',0,'0',0),
 (2,'leaf','a broad shaped green leaf','3','0.5','0.5',0,'-',0),
 (3,'dowsing rod','a finely made dowser\'s rod','2000x','0.5','0.5',0,'-',0),
 (4,'acorn','an ordinary acorn','1','0.5','0.5',0,'-',0),
 (5,'seedling','a collection of unidentified seeds','0','0.5','0.5',0,'-',0),
 (6,'mineral ore','a lump of inert rock','420','0.5','0.5',0,'-',0),
 (7,'potion','a strange green liquid','40p','0.5','0.5',0,'-',0),
 (8,'a rare mushroom','a very unusual mushroom','0q','0.5','0.5',0,'-',0),
 (9,'trowel','an ordinary garden trowel','0q','0.5','0.5',0,'-',0),
 (10,'mysterious potion','a strange liquid','0q','0.5','0.5',5,'-',0),
 (11,'mushroom','tasty fungi','20','0.5','0.5',2,'-',0),
 (12,'some clothing','a nice outfit','90','0.5','0.5',0,'-',0),
 (13,'a rare gift','an unknown package','450','0.5','0.5',0,'-',0),
 (14,'silence boots','silence inducing boots','0u','0.5','0.5',0,'-',0);
INSERT INTO `tblinventoryitems` (`itemID`,`shortname`,`description`,`priceCode`,`tilex`,`tiley`,`worldGraphic`,`requirements`,`itemType`) VALUES 
 (15,'prism','a shining sculpture','400x','0.5','0.5',1,'-',0),
 (16,'large back pack','a 6 slot container','120b6','0.5','0.5',0,'-',0),
 (17,'signpost','<-- harbour   amber coast -->','-','0.5','0.5',7,'-',0),
 (18,'wanted poster','5#reward offered for 2 prisms taken to the collector~`reward offered for 2 prisms taken to the collector~prisms successfully found','-','0.5','0.5',8,'-',0),
 (19,'harvestable resource','1.21/1.21/1.21/1.21/2.21/2.21/2.21/3.21/1.22/1.22|2.21','-','0.5','0.5',20,'-',0),
 (20,'place holder for harvestable resource','ph','1','0.5','0.5',21,'-',0),
 (21,'green frond','an ordinary fern','5h','0.5','0.5',0,'-',0),
 (22,'gold frond','a rare fern','200h','0.5','0.5',0,'-',0),
 (23,'ground chest closed','-','-','0.5','0.5',10,'-',0),
 (24,'ground chest open','-','-','0.5','0.5',11,'-',0),
 (25,'raised chest closed','-','-','0.5','0.5',12,'-',0),
 (26,'raised chest open','-','-','0.5','0.5',13,'-',0);
INSERT INTO `tblinventoryitems` (`itemID`,`shortname`,`description`,`priceCode`,`tilex`,`tiley`,`worldGraphic`,`requirements`,`itemType`) VALUES 
 (27,'silver coins','-','£','0.5','0.5',0,'-',0),
 (28,'gold coins','-','£','0.5','0.5',0,'-',0),
 (29,'large back pack','a 10 slot container','200b10','0.5','0.5',0,'-',0),
 (30,'potion recipe','makes a mysterious potion','10r10','0.5','0.5',0,'1.21/2.22',0),
 (31,'potion recipe','makes an ordinary potion','4r7','0.5','0.5',0,'1.11/250£',0),
 (32,'potion recipe','makes a red prism','4r15','0.5','0.5',0,'1.11/150£',0),
 (33,'rusty key','an antique key','0u','0.5','0.5',0,'-',0),
 (34,'rusty key - used','an antique key - this key has been used','0u','0.5','0.5',0,'-',0);
/*!40000 ALTER TABLE `tblinventoryitems` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblmail`
--

DROP TABLE IF EXISTS `tblmail`;
CREATE TABLE `tblmail` (
  `mailID` int(11) NOT NULL auto_increment,
  `accountID` int(11) default NULL,
  `senderID` int(11) default NULL,
  `senderName` varchar(255) default NULL,
  `characterID` int(11) default NULL,
  `title` varchar(255) default NULL,
  `mailContents` mediumtext,
  `sentTime` datetime default NULL,
  `mailRead` char(1) default NULL,
  `AttachmentType` int(11) default NULL,
  `AttachmentQuantity` int(11) default NULL,
  PRIMARY KEY  (`mailID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblmail`
--

/*!40000 ALTER TABLE `tblmail` DISABLE KEYS */;
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (81,18,5,'Eleaddai',10,'elli to newmemberchar1','c to c','2006-08-02 22:10:06','1',0,0),
 (83,5,18,'newmemberchar1',2,'Re: elli to newmemberchar1','[quote=Eleaddai]c to c[/quote] m','2006-08-02 22:13:05','2',0,0),
 (84,18,5,'Eleaddai',10,'Re: Re: elli to newmemberchar1','[quote=newmemberchar1][quote=Eleaddai]c to c[/quote] m[/quote]xc','2006-08-02 22:13:30','2',0,0),
 (85,14,5,'Alice',0,'alice to moderator','c to a','2006-08-02 22:14:08','1',0,0),
 (86,5,14,'moderator',3,'Re: alice to moderator','[quote=Alice]c to a[/quote]x','2006-08-02 22:14:24','2',0,0),
 (87,14,5,'Alice',0,'Re: Re: alice to moderator','[quote=moderator][quote=Alice]c to a[/quote]x[/quote]xc','2006-08-02 22:14:59','2',0,0),
 (88,14,5,'seawarrior',0,'seawarrior to moderator','a to a','2006-08-02 22:15:22','2',0,0),
 (89,5,14,'moderator',0,'Re: seawarrior to moderator','[quote=seawarrior]a to a[/quote] ta','2006-08-02 22:15:39','2',0,0),
 (90,14,5,'seawarrior',0,'Re: Re: seawarrior to moderator','[quote=moderator][quote=seawarrior]a to a[/quote] ta[/quote] cvc','2006-08-02 22:15:56','0',0,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (91,18,5,'seawarrior',10,'seawarrior to newmemberchar1','a to c','2006-08-02 22:16:31','2',0,0),
 (92,5,18,'newmemberchar1',0,'Re: seawarrior to newmemberchar1',' cheers','2006-08-02 22:16:53','1',0,0),
 (93,18,5,'seawarrior',10,'Re: Re: seawarrior to newmemberchar1','[quote=newmemberchar1] cheers[/quote] go','2006-08-02 22:17:07','2',0,0),
 (94,18,14,'modchar2',11,'to newmem char2','dffd','2006-08-03 14:08:45','1',0,0),
 (95,14,5,'seawarrior',0,'styled stuff','fgfgfg[link=dfdf]dfdf[/link]cxcxc[image=xcx]\r\n\r\n\r\nh[u]ap[/u]py ','2006-08-06 21:44:37','1',0,0),
 (96,5,14,'moderator',0,'Re: styled stuff','[quote=seawarrior]fgfgfg[link=dfdf]dfdf[/link]cxcxc[/quote][image=xcx]\r\n\r\n\r\nh[u]ap[/u]py  cheers boss :) [u]underline[/u][','2006-08-06 21:46:52','1',0,0),
 (97,14,5,'seawarrior',0,'blibllw','sd[s]fdf[/s] this is a report test','2006-08-13 15:57:15','1',0,0),
 (98,14,5,'seawarrior',0,'test atach','df','2006-08-14 19:21:11','0',0,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (99,14,5,'seawarrior',0,'test','dfdf','2006-08-14 19:22:59','0',0,0),
 (100,14,5,'seawarrior',0,'test','dfdfdf','2006-08-14 19:24:52','0',0,0),
 (101,14,5,'seawarrior',0,'spam','s','2006-08-14 19:26:28','0',0,0),
 (102,14,5,'seawarrior',0,'spam2','sdsd','2006-08-14 19:27:02','0',0,0),
 (103,14,5,'seawarrior',0,'spam3','dsds','2006-08-14 19:28:33','0',0,0),
 (104,14,5,'seawarrior',0,'spam4','dsds','2006-08-14 19:29:59','0',0,0),
 (105,14,5,'seawarrior',0,'sfdff','dfdf','2006-08-14 19:31:19','0',0,0),
 (106,14,5,'seawarrior',0,'guess what? spam','dsd','2006-08-14 19:33:15','0',0,0),
 (107,14,5,'seawarrior',0,'stuff','sdsd','2006-08-14 21:48:17','0',0,0),
 (108,14,5,'seawarrior',0,'test','test','2006-08-17 13:02:52','0',0,0),
 (109,14,5,'seawarrior',0,'testing','fdlfkdk lfkskf','2006-08-17 13:12:46','0',0,0),
 (110,14,5,'Eleaddai',0,'john','dddddd','2006-08-17 13:27:41','0',0,0),
 (111,5,14,'seawarrior',0,'Re: blibllw','[quote=seawarrior]sdfdf this is a report test[/quote]fdf','2006-08-17 20:45:01','1',0,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (112,14,5,'seawarrior',0,'Re: Re: styled stuff','[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghghh','2006-08-17 20:46:00','0',0,0),
 (113,14,5,'seawarrior',0,'Re: Re: styled stuff','[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]dfdfdfdf','2006-08-17 20:47:17','0',0,0),
 (114,14,18,'newmemberchar2',8,'Re: to newmem char2','[quote=modchar2]dffd[/quote]\r\nklklk','2006-08-17 20:48:22','1',0,0),
 (115,14,18,'newmemberchar2',8,'Re: to newmem char2','[quote=modchar2]dffd[/quote]','2006-08-17 21:03:09','0',0,0),
 (116,14,5,'seawarrior',0,'Re: Re: styled stuff','[quote=moderator]fgfgfgdfdfcxcxc\r\n\r\n\r\nhappy  cheers boss  underline[/quote]ghg','2006-08-17 21:03:46','0',0,0),
 (117,14,5,'seawarrior',0,'howdo','dfdf','2006-08-17 21:13:10','0',0,0),
 (118,14,5,'seawarrior',0,'ljlj','lkj','2006-08-17 21:13:56','0',0,0),
 (119,14,5,'seawarrior',0,'lkj','lkj','2006-08-17 21:15:54','0',0,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (120,14,5,'seawarrior',0,'jkh','kjhkh','2006-08-17 21:16:09','0',0,0),
 (121,14,5,'seawarrior',0,'(untitled)','sd','2006-08-17 21:23:42','0',0,0),
 (122,14,5,'seawarrior',0,'adding items :)','here you go: 3 scrolls','2006-08-20 10:44:47','1',0,0),
 (123,14,5,'seawarrior',0,'teasing','asas','2006-08-20 10:49:18','0',0,0),
 (124,14,5,'seawarrior',0,'adding then changoing','3 scrolls then 1 leaf','2006-08-20 10:49:53','1',0,0),
 (125,13,5,'seawarrior',0,'sending stuff','1 mushroom coming at ya','2006-08-20 11:15:20','1',11,1),
 (126,14,5,'seawarrior',0,'another shrooom','','2006-08-20 11:17:31','1',0,0),
 (127,14,5,'seawarrior',0,'removing 1 scroll','1 scroll','2006-08-20 11:28:46','1',0,0),
 (128,14,5,'seawarrior',0,'all my shrooms','sdds','2006-08-20 11:31:21','1',0,0),
 (129,14,5,'seawarrior',0,'all 4 shrooms','sds','2006-08-20 11:33:32','1',0,0),
 (130,14,5,'seawarrior',0,'9 shrooms','sd','2006-08-20 11:37:22','1',11,9);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (131,14,5,'seawarrior',0,'sd','sdsd','2006-08-20 20:29:10','1',0,0),
 (132,14,5,'seawarrior',0,'sds','sd','2006-08-20 20:29:20','1',0,0),
 (133,5,14,'moderator',0,'df','df','2006-08-20 20:32:20','1',0,0),
 (134,14,5,'seawarrior',0,'sd','asas','2006-08-20 20:34:20','1',0,0),
 (135,14,5,'seawarrior',0,'df','dfsfd','2006-08-20 20:37:45','1',0,0),
 (136,5,14,'moderator',0,'cheers','cv','2006-08-20 20:40:23','2',0,0),
 (137,14,5,'seawarrior',0,'sddf','dfdf','2006-08-20 20:41:35','1',0,0),
 (138,14,23,'stanley',0,'sddsd','sads','2006-08-20 20:42:41','2',2,5),
 (139,5,23,'stanley',1,'stan to angel','3 scrolls...','2006-08-20 23:02:56','1',0,0),
 (140,14,23,'stanley',7,'modchar1 from stan','sdsds','2006-08-21 18:55:28','1',0,0),
 (141,14,5,'seawarrior',0,'test attach','adding 2 scrolls','2006-08-30 09:09:04','1',0,0),
 (142,14,5,'seawarrior',0,'(untitled)','','2006-11-05 10:42:52','0',2,6),
 (143,14,5,'seawarrior',0,'(untitled)','','2006-11-05 10:43:42','0',11,1);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (144,14,5,'Alice',7,'1 gold','1 gold!!!','2006-12-02 21:40:27','0',0,0),
 (145,14,5,'Alice',7,'1 gold 27 s','1g 27s','2006-12-02 21:49:31','0',28,127),
 (146,14,5,'seawarrior',7,'21 silver','21 !!!!','2006-12-02 22:04:04','0',27,21),
 (147,14,5,'seawarrior',7,'21','21 again','2006-12-02 22:06:36','0',27,21),
 (148,14,5,'seawarrior',7,'21 .. .again!','df','2006-12-02 22:07:52','0',27,21),
 (149,14,5,'seawarrior',7,'(untitled)','','2006-12-02 22:08:16','0',27,21),
 (150,14,5,'seawarrior',7,'guess what?','(no message)','2006-12-02 22:10:27','0',27,21),
 (151,14,5,'seawarrior',7,'sd','(no message)','2006-12-02 22:11:12','0',27,21),
 (152,14,5,'Alice',7,'got to be 21 now','(no message)','2006-12-02 22:14:27','0',27,21),
 (153,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:18:16','0',27,21),
 (154,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:18:47','0',27,22),
 (155,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:20:48','0',27,22);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (156,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:21:11','0',27,23),
 (157,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:22:27','0',27,21),
 (158,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:23:04','0',27,21),
 (159,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:23:28','0',28,199),
 (160,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:24:25','0',28,102),
 (161,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:24:38','0',28,100),
 (162,14,5,'seawarrior',7,'(untitled)','(no message)','2006-12-02 22:25:03','0',27,20),
 (163,23,5,'seawarrior',4,'(untitled)sd','(no message)sd','2006-12-18 22:27:09','0',28,0),
 (164,23,5,'seawarrior',4,'hiya','fgfg','2006-12-18 22:31:55','0',27,0),
 (165,23,5,'seawarrior',4,'18','eighteen coming across!','2006-12-18 22:33:29','0',27,0),
 (166,23,5,'Angel',4,'ten','fg ddf','2006-12-18 22:46:19','0',27,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (167,23,5,'Angel',4,'seven','cvc','2006-12-18 22:48:39','0',27,0),
 (168,23,5,'Angel',4,'test','xc','2006-12-18 22:49:30','0',27,0),
 (169,23,5,'Angel',4,'ninteen','fd','2006-12-18 22:50:20','0',27,0),
 (170,23,5,'Angel',4,'sdsd','sd','2006-12-18 22:51:09','0',27,0),
 (171,23,5,'Angel',4,'78','ghgh','2006-12-18 22:53:01','0',27,0),
 (172,23,5,'Angel',1,'fdfdf','(no message)','2006-12-18 22:57:28','0',27,19),
 (173,23,5,'Angel',1,'hi','(no message)','2006-12-18 22:58:29','0',27,19),
 (174,23,5,'Angel',1,'jkiol','gfg gddf ','2006-12-18 22:59:53','0',27,19),
 (175,23,5,'seawarrior',1,'more','(no message)','2006-12-18 23:00:23','0',28,102),
 (176,13,5,'seawarrior',0,'testing refresh','testing! :) ','2007-01-08 20:17:09','1',0,0),
 (177,13,5,'seawarrior',0,'refresh test 2','dsd','2007-01-08 20:17:46','1',0,0),
 (178,13,5,'seawarrior',0,'another test','sdsd aa','2007-01-08 20:38:42','1',0,0),
 (179,5,13,'administrator',0,'Re: refresh test 2','[quote=seawarrior]dsd[/quote]cheers matey','2007-01-10 22:50:47','1',0,0);
INSERT INTO `tblmail` (`mailID`,`accountID`,`senderID`,`senderName`,`characterID`,`title`,`mailContents`,`sentTime`,`mailRead`,`AttachmentType`,`AttachmentQuantity`) VALUES 
 (180,5,13,'administrator',0,'Re: another test','[quote=seawarrior]sdsd aa[/quote]nice one','2007-01-10 22:51:18','0',0,0),
 (181,13,5,'seawarrior',0,'Re: Re: refresh test 2','thanks','2007-01-10 22:54:13','0',0,0);
/*!40000 ALTER TABLE `tblmail` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblmainpoll`
--

DROP TABLE IF EXISTS `tblmainpoll`;
CREATE TABLE `tblmainpoll` (
  `pollID` int(11) NOT NULL auto_increment,
  `question` varchar(255) default NULL,
  `isCurrent` tinyint(1) default NULL,
  PRIMARY KEY  (`pollID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblmainpoll`
--

/*!40000 ALTER TABLE `tblmainpoll` DISABLE KEYS */;
INSERT INTO `tblmainpoll` (`pollID`,`question`,`isCurrent`) VALUES 
 (1,'is this site finished yet?',1),
 (2,'would you be happy paying for additional items?',0),
 (3,'what features would you like to see next?',0);
/*!40000 ALTER TABLE `tblmainpoll` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblmainpollchoices`
--

DROP TABLE IF EXISTS `tblmainpollchoices`;
CREATE TABLE `tblmainpollchoices` (
  `choiceID` int(11) NOT NULL auto_increment,
  `pollID` int(11) default NULL,
  `response` varchar(255) default NULL,
  `voteCount` int(11) default NULL,
  PRIMARY KEY  (`choiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblmainpollchoices`
--

/*!40000 ALTER TABLE `tblmainpollchoices` DISABLE KEYS */;
INSERT INTO `tblmainpollchoices` (`choiceID`,`pollID`,`response`,`voteCount`) VALUES 
 (1,1,'yes',3),
 (2,1,'no',4),
 (3,1,'don\'t know',9);
/*!40000 ALTER TABLE `tblmainpollchoices` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblnews`
--

DROP TABLE IF EXISTS `tblnews`;
CREATE TABLE `tblnews` (
  `newsID` int(11) NOT NULL auto_increment,
  `newsTitle` varchar(255) default NULL,
  `newsSynopsis` varchar(255) default NULL,
  `newsContent` longtext,
  `status` char(1) default NULL,
  `timeAdded` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `postedBy` varchar(50) default NULL,
  PRIMARY KEY  (`newsID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblnews`
--

/*!40000 ALTER TABLE `tblnews` DISABLE KEYS */;
INSERT INTO `tblnews` (`newsID`,`newsTitle`,`newsSynopsis`,`newsContent`,`status`,`timeAdded`,`postedBy`) VALUES 
 (1,'Spring is on its way','Face towards the rising sun and travel eastwards','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>','1','2007-01-03 21:14:13',NULL),
 (2,'New Year spectacular','Fireworks and plenty of festive cheer','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>','1','2007-01-03 21:09:20','The Mayor');
INSERT INTO `tblnews` (`newsID`,`newsTitle`,`newsSynopsis`,`newsContent`,`status`,`timeAdded`,`postedBy`) VALUES 
 (3,'more seasonal joy','brace yourselves!','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. [CONTINUE]Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum <a href=\"/\" title=\"click to view\">dolore eu feugiat</a> nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><h3>Lorem ipsum</h3><p>\"Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh\", euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>','1','2007-01-02 20:43:36',NULL),
 (4,'April Fools has been and gone','well, we missed that one...','april fools has \"been\" &quot;and&quot; gone again &raquo; arrow','1','2007-05-04 09:03:49',NULL);
/*!40000 ALTER TABLE `tblnews` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblposts`
--

DROP TABLE IF EXISTS `tblposts`;
CREATE TABLE `tblposts` (
  `postID` int(11) NOT NULL auto_increment,
  `threadID` mediumint(9) NOT NULL default '0',
  `accountID` int(11) NOT NULL default '0',
  `creationTime` datetime default NULL,
  `postContent` mediumtext,
  `status` char(1) default NULL,
  `sticky` char(1) default NULL,
  `edited` datetime default NULL,
  PRIMARY KEY  (`postID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblposts`
--

/*!40000 ALTER TABLE `tblposts` DISABLE KEYS */;
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (116,24,5,'2006-07-23 09:07:24','[h]welcome everyone[/h] to this forum','1','0','0000-00-00 00:00:00'),
 (117,24,13,'2006-07-23 09:07:56','absolutely, please join in the discussion','1','0','0000-00-00 00:00:00'),
 (118,25,13,'2006-07-23 09:09:03','[b]a bold message too[/b]','1','0','0000-00-00 00:00:00'),
 (119,25,13,'2006-07-23 09:13:18','an [i]italic [/i]post','1','0','0000-00-00 00:00:00'),
 (120,26,13,'2006-07-23 09:14:03','1','1','0','0000-00-00 00:00:00'),
 (121,26,13,'2006-07-23 09:14:07','2','1','0','0000-00-00 00:00:00'),
 (122,26,13,'2006-07-23 09:14:10','3','1','0','0000-00-00 00:00:00'),
 (123,26,13,'2006-07-23 09:14:13','4','1','0','0000-00-00 00:00:00'),
 (124,26,13,'2006-07-23 09:14:15','5','1','0','0000-00-00 00:00:00'),
 (125,26,13,'2006-07-23 09:14:18','6','1','0','0000-00-00 00:00:00'),
 (126,26,13,'2006-07-23 09:14:21','7','1','0','0000-00-00 00:00:00'),
 (127,26,13,'2006-07-23 09:14:24','8','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (128,26,13,'2006-07-23 09:14:26','9','1','0','0000-00-00 00:00:00'),
 (129,26,13,'2006-07-23 09:14:30','10','1','0','0000-00-00 00:00:00'),
 (130,26,13,'2006-07-23 09:14:33','11','1','0','0000-00-00 00:00:00'),
 (131,26,13,'2006-07-23 09:18:04','12','1','0','0000-00-00 00:00:00'),
 (132,26,13,'2006-07-23 09:18:07','13','1','0','0000-00-00 00:00:00'),
 (133,26,13,'2006-07-23 09:18:09','14','1','0','0000-00-00 00:00:00'),
 (134,26,13,'2006-07-23 09:18:12','15','1','0','0000-00-00 00:00:00'),
 (135,27,13,'2006-07-23 09:19:35','this is very seroius...','1','0','0000-00-00 00:00:00'),
 (136,28,13,'2006-07-23 09:20:57','so exciting all this, isn\'t it?','1','0','0000-00-00 00:00:00'),
 (137,26,18,'2006-07-23 10:07:02','inserting link [link=location.co.uk]location.co.uk[/link]','1','0','0000-00-00 00:00:00'),
 (138,26,18,'2006-07-23 10:07:41','john [u]holt[/u] john','1','0','2006-07-23 10:07:48'),
 (139,26,18,'2006-07-23 10:13:28','adding a link [link=linklocation.co.uk]linklocation.co.uk[/link]','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (140,29,18,'2006-07-23 10:22:42','good this :)','1','0','0000-00-00 00:00:00'),
 (141,24,13,'2006-07-23 14:29:41','a new posting','1','0','0000-00-00 00:00:00'),
 (142,24,13,'2006-07-23 14:29:58','another :)','1','0','0000-00-00 00:00:00'),
 (143,30,13,'2006-07-23 14:30:59','...','1','0','0000-00-00 00:00:00'),
 (144,24,13,'2006-07-23 14:59:09',':(','1','0','0000-00-00 00:00:00'),
 (145,28,5,'2006-07-23 16:11:27','seawarrior makes a post :)','1','0','0000-00-00 00:00:00'),
 (146,28,5,'2006-07-23 16:12:10','and another','1','0','2006-07-23 16:13:45'),
 (147,28,5,'2006-07-23 16:12:59','oi oi ','1','0','2006-07-23 16:13:52'),
 (148,28,13,'2006-07-23 16:25:39','admin response','1','0','0000-00-00 00:00:00'),
 (149,28,5,'2006-07-23 16:25:55','me again :)','1','0','0000-00-00 00:00:00'),
 (150,28,5,'2006-07-23 16:26:49','...and again','1','0','0000-00-00 00:00:00'),
 (151,28,13,'2006-07-23 16:27:09','admin response #2','1','0','0000-00-00 00:00:00'),
 (152,28,5,'2006-07-23 16:29:08','seawarrior rcepsonse','1','0','2006-07-28 09:14:09');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (153,28,13,'2006-07-23 16:29:25','admin repsonse # 3','1','0','0000-00-00 00:00:00'),
 (154,28,5,'2006-07-23 16:30:24','[u]seawarrior is back[/u]','1','0','0000-00-00 00:00:00'),
 (155,24,5,'2006-07-27 13:23:03','a link to [link=http://www.google.co.uk]google[/link]','1','0','0000-00-00 00:00:00'),
 (156,31,5,'2006-07-27 13:26:36','here\'s a mail icon:\r\n\r\n[image=http://autumnearth.metafocusclients.co.uk/assets/mail/new_mail.gif]\r\ncool eh?','1','0','2006-07-27 13:26:46'),
 (157,31,5,'2006-07-27 13:27:14','here\'s a quick quote that i made up\r\n\r\n[quote = john]stuff john said[/quote]','1','0','2006-07-27 13:28:20'),
 (158,31,5,'2006-07-27 13:29:29','and a link to [link=http://www.flashkit.com]flashkit[/link] is here','1','0','0000-00-00 00:00:00'),
 (159,31,5,'2006-07-27 13:32:52','a huuuuge image [b]with a link[/b]:\r\n\r\n\r\n\r\n\r\n[link=www.salmacis.co.uk]\r\n[/link][image=http://www.salmacis.co.uk/elements/splash_page531x531.jpg]but it\'s been[ cropped','1','0','2006-07-27 22:04:02'),
 (160,31,5,'2006-07-27 13:41:32','just this [image=\'http://www.salmacis.co.uk/elements/lookingglass1b.jpg\']','1','0','2006-07-27 13:52:30');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (161,31,13,'2006-07-27 18:25:59','badly nested tags:\r\n[b]bold text [/b][image = http://autumnearth.metafocusclients.co.uk/assets/forum/bugforum.gif]\r\n\r\nclose bold ','1','0','2006-07-27 18:37:02'),
 (162,31,14,'2006-07-27 21:13:26','[u] underlined [/u][image=http://autumnearth.metafocusclients.co.uk/assets/forum/suggestforum.gif]\r\nnormal [b] bold[/b]','1','0','0000-00-00 00:00:00'),
 (163,31,14,'2006-07-27 21:25:59','close bold  and i\'ve then [h]added this[/h]','1','0','2006-07-27 21:34:39'),
 (164,30,14,'2006-07-27 21:35:14','[quote=Administrator]...[/quote] and my bit :)','1','0','0000-00-00 00:00:00'),
 (165,31,14,'2006-07-27 21:37:28','[quote=seawarrior]here\'s a mail icon:\r\n\r\n\r\ncool eh?[/quote] and my bit','1','0','0000-00-00 00:00:00'),
 (166,31,14,'2006-07-27 21:39:23','[quote=Moderator]here\'s a mail icon:\r\n\r\n\r\ncool eh? and my bit[/quote] and yet another bit','1','0','0000-00-00 00:00:00'),
 (167,31,14,'2006-07-27 21:39:54','[quote=seawarrior]and a link to flashkit is here[/quote] without link','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (168,30,5,'2006-07-27 21:55:23','[e]invalid links [t] and [r]','1','0','0000-00-00 00:00:00'),
 (169,24,5,'2006-07-28 07:45:33','[quote=seawarrior]welcome everyone to this forum[/quote]\r\nnow i\'ll add a link [link=http://www.google.com]http://www.google.com[/link]','1','0','0000-00-00 00:00:00'),
 (170,24,5,'2006-07-28 07:46:14','lots of space:\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nend','1','0','2006-07-28 08:41:42'),
 (171,30,5,'2006-07-28 09:07:14','mew post','1','0','0000-00-00 00:00:00'),
 (172,28,5,'2006-07-28 21:21:35','dfdf','1','0','0000-00-00 00:00:00'),
 (173,26,5,'2006-07-29 23:49:21','oi','1','0','0000-00-00 00:00:00'),
 (174,30,5,'2006-08-01 18:27:05','[quote=seawarrior]mew post[/quote]sorry\r\n','1','0','0000-00-00 00:00:00'),
 (175,30,5,'2006-08-13 11:06:42','[linkninglinkng','1','0','0000-00-00 00:00:00'),
 (176,32,5,'2006-08-13 11:07:19','lin[link=ok.com]kni[/link]nglinkng','1','0','0000-00-00 00:00:00'),
 (177,28,5,'2006-08-13 11:23:36','stuff adding stuff','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (178,28,5,'2006-08-13 11:25:57','stuff and link','1','0','0000-00-00 00:00:00'),
 (179,28,5,'2006-08-13 11:26:56','stuff link and link','1','0','0000-00-00 00:00:00'),
 (180,31,5,'2006-08-13 11:34:06','stuff posting','1','0','0000-00-00 00:00:00'),
 (181,31,5,'2006-08-13 11:37:51','stuff linking stuff','1','0','0000-00-00 00:00:00'),
 (182,31,5,'2006-08-13 11:39:13','post link ','1','0','0000-00-00 00:00:00'),
 (183,31,5,'2006-08-13 11:39:45','and another ','1','0','0000-00-00 00:00:00'),
 (184,31,5,'2006-08-13 11:40:31','[linklinklink','1','0','0000-00-00 00:00:00'),
 (185,31,5,'2006-08-13 11:41:17','anotheranother','1','0','0000-00-00 00:00:00'),
 (186,31,5,'2006-08-13 11:43:17','stuffsdsdsd','1','0','0000-00-00 00:00:00'),
 (187,31,5,'2006-08-13 11:43:48','gfhghgh g','1','0','0000-00-00 00:00:00'),
 (188,31,5,'2006-08-13 11:44:34','hjhjhgjhgj','1','0','0000-00-00 00:00:00'),
 (189,31,5,'2006-08-13 12:00:07','fgfdgfdgfggg fd','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (190,31,5,'2006-08-13 12:02:19','fgfgfgfdgfgf','1','0','0000-00-00 00:00:00'),
 (191,31,5,'2006-08-13 12:03:06','ghghghggh','1','0','0000-00-00 00:00:00'),
 (192,31,5,'2006-08-13 12:05:24','gfk[link=df]lgjdf[/link]lgjldfjgldfg','1','0','0000-00-00 00:00:00'),
 (193,32,5,'2006-08-13 12:10:10','gkhgkh;[link=john.com]gkh;[/link]g;hg;hgfhgf','1','0','0000-00-00 00:00:00'),
 (194,29,14,'2006-08-13 12:11:37','gkjkj[link=http://www.john.com]hgj[/link]ljhlgjhjglhjfljhlgjhlgfjlh','1','0','0000-00-00 00:00:00'),
 (195,29,14,'2006-08-13 12:12:09','gh[link=gh]hgg[/link]ghg','1','0','0000-00-00 00:00:00'),
 (196,33,5,'2006-08-13 12:15:14','johnjohn[link=ohyeah.co.uk]is[/link]john','1','0','2006-09-11 08:55:30'),
 (197,34,5,'2006-08-13 12:18:38','stufff with [link=http://www.google.com]links [/link]and stuff ','1','0','0000-00-00 00:00:00'),
 (198,35,5,'2006-08-13 12:22:03','xcxcxc[image=http://www.autumnearth.com/data/chr3/portrait.jpg]xcxczxcsc ','1','0','0000-00-00 00:00:00'),
 (199,35,5,'2006-10-26 19:38:26','[link=http://www.goole.com]link[/link]','1','0','0000-00-00 00:00:00');
INSERT INTO `tblposts` (`postID`,`threadID`,`accountID`,`creationTime`,`postContent`,`status`,`sticky`,`edited`) VALUES 
 (200,28,5,'2006-12-31 20:04:51','what\'s all this then? is this john\'s post?','1','0','0000-00-00 00:00:00'),
 (201,28,5,'2006-12-31 20:21:06','...hang on, what\'s this one then?\r\n...oh, i get it :)','1','0','0000-00-00 00:00:00'),
 (202,25,5,'2007-01-01 22:55:17','JOHN\'S post','1','0','0000-00-00 00:00:00'),
 (203,25,5,'2007-01-01 23:18:05','[quote=Administrator]a bold message too[/quote] checking :)','1','0','0000-00-00 00:00:00'),
 (204,25,5,'2007-01-11 21:36:36','&quot;what\'s all this then?&quot; he asked','1','0','0000-00-00 00:00:00'),
 (205,34,5,'2007-02-12 11:08:02','hiya','1','0','0000-00-00 00:00:00'),
 (206,36,5,'2007-05-08 18:33:13','what components/tools do I need to start herbalism?','1','0','0000-00-00 00:00:00'),
 (207,34,5,'2007-05-08 18:33:54','feeding pets? how does that work? ','1','0','0000-00-00 00:00:00'),
 (208,31,5,'2007-05-09 08:48:11','pet development - sounds good','1','0','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `tblposts` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblsavedsearches`
--

DROP TABLE IF EXISTS `tblsavedsearches`;
CREATE TABLE `tblsavedsearches` (
  `searchID` int(11) NOT NULL auto_increment,
  `searchTerm` varchar(255) default NULL,
  `searchCount` int(11) default NULL,
  PRIMARY KEY  (`searchID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblsavedsearches`
--

/*!40000 ALTER TABLE `tblsavedsearches` DISABLE KEYS */;
INSERT INTO `tblsavedsearches` (`searchID`,`searchTerm`,`searchCount`) VALUES 
 (1,'crafting',6),
 (2,'feeding pets',2),
 (3,'image',7),
 (4,'autumn',2),
 (5,'autumn earth',2),
 (6,'character development',0),
 (11,'pte development',0),
 (8,'pet development',2),
 (10,'pte development',0),
 (12,'pet developmetn',0),
 (13,'carfting',0),
 (14,'carfting',0),
 (15,'feeding ptse',0),
 (16,'feding pste',0),
 (17,'cheese',0),
 (18,'gemai',0),
 (19,'iiiimage',0),
 (20,'crrrrrrrrrafting',0),
 (21,'speling',0),
 (22,'fgf',1),
 (23,'gf',1);
/*!40000 ALTER TABLE `tblsavedsearches` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblsubscribedthreads`
--

DROP TABLE IF EXISTS `tblsubscribedthreads`;
CREATE TABLE `tblsubscribedthreads` (
  `subthreadID` int(11) NOT NULL auto_increment,
  `accountID` int(11) default NULL,
  `threadID` int(11) default NULL,
  `status` char(1) default NULL,
  PRIMARY KEY  (`subthreadID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblsubscribedthreads`
--

/*!40000 ALTER TABLE `tblsubscribedthreads` DISABLE KEYS */;
INSERT INTO `tblsubscribedthreads` (`subthreadID`,`accountID`,`threadID`,`status`) VALUES 
 (5,13,30,'1'),
 (18,13,31,'1'),
 (24,14,25,'1'),
 (28,14,31,'1'),
 (29,5,31,'0'),
 (30,5,30,'0'),
 (31,5,32,'0'),
 (32,5,28,'0'),
 (33,14,29,'0'),
 (34,5,33,'0'),
 (35,5,34,'0'),
 (36,5,35,'0'),
 (37,5,25,'0'),
 (38,5,36,'0');
/*!40000 ALTER TABLE `tblsubscribedthreads` ENABLE KEYS */;


--
-- Table structure for table `autumnearth`.`tblthreads`
--

DROP TABLE IF EXISTS `tblthreads`;
CREATE TABLE `tblthreads` (
  `threadID` int(11) NOT NULL auto_increment,
  `forumID` int(11) default NULL,
  `accountID` int(11) default NULL,
  `viewCount` int(11) default NULL,
  `CreationTime` datetime default NULL,
  `status` char(1) default NULL,
  `sticky` char(1) default NULL,
  `title` mediumtext,
  `latestPostID` int(11) default NULL,
  `postcount` int(11) default NULL,
  PRIMARY KEY  (`threadID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autumnearth`.`tblthreads`
--

/*!40000 ALTER TABLE `tblthreads` DISABLE KEYS */;
INSERT INTO `tblthreads` (`threadID`,`forumID`,`accountID`,`viewCount`,`CreationTime`,`status`,`sticky`,`title`,`latestPostID`,`postcount`) VALUES 
 (24,3,5,26,'2006-07-23 09:07:24','2','0','Welcome, Welcome',170,8),
 (25,3,13,27,'2006-07-23 09:09:03','2','0','[b]this is a bold title[/b]',204,5),
 (26,3,13,19,'2006-07-23 09:14:03','2','0','counting...',173,19),
 (27,3,13,11,'2006-07-23 09:19:35','1','1','Important Announcement',135,1),
 (28,3,13,25,'2006-07-23 09:20:57','2','0','another thread',201,17),
 (29,2,18,20,'2006-07-23 10:22:42','2','0','hello',195,3),
 (30,3,13,27,'2006-07-23 14:30:59','2','0','new thread :)',175,6),
 (31,1,5,47,'2006-07-27 13:26:36','2','0','showing an image',208,25),
 (32,3,5,43,'2006-08-13 11:07:19','2','0','john',193,2),
 (33,3,5,15,'2006-08-13 12:15:14','2','0','my title',196,1),
 (34,3,5,54,'2006-08-13 12:18:38','2','0','googlelink',207,3),
 (35,3,5,18,'2006-08-13 12:22:03','2','0','l=img thread',199,2),
 (36,2,5,26,'2007-05-08 18:33:13','2','0','crafting',206,1);
/*!40000 ALTER TABLE `tblthreads` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
