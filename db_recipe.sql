-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 07:33 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_recipe`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_configs`
--

CREATE TABLE `api_configs` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `app_id` varchar(255) NOT NULL,
  `api_url` varchar(255) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `api_configs`
--

INSERT INTO `api_configs` (`id`, `name`, `app_id`, `api_url`, `api_key`, `created_at`, `updated_at`) VALUES
(1, 'Game List', '771', 'https://api-gametest.omgapi.cc/api/game/loadlist', 'dc7df6a77d8e82fcf26062d773b8d385', '2024-10-17 04:52:28', '2024-10-17 04:52:31');

-- --------------------------------------------------------

--
-- Table structure for table `api_key`
--

CREATE TABLE `api_key` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_key`
--

INSERT INTO `api_key` (`id`, `merchant_id`, `key`, `password`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, 'hkttruzpxboovmme7s7ua6cppa6m0xp8', 'xRSLnG38I9uH', 1, '2024-12-08 13:33:06', '2024-12-08 15:26:39'),
(4, 3, 'TQUiTZzqypMpwSNTaKS1kye2p1MGd4tNvK', 'LRWwU5D6womf', 1, '2024-12-08 15:26:59', '2025-01-12 23:21:37'),
(5, 5, '5yjjrs1dqc064ikm9zf1opiyblj4xn4n', 'cTQt96aJIQZg', 1, '2024-12-08 15:30:33', '2024-12-08 15:30:33'),
(7, 22, 'a1z796m6004vd9t6euj6aheey7pieprg', 'BuUWvdAEE6pw', 1, '2025-01-10 14:39:03', '2025-01-10 14:39:03');

-- --------------------------------------------------------

--
-- Table structure for table `bed_type`
--

CREATE TABLE `bed_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bed_type`
--

INSERT INTO `bed_type` (`id`, `name`, `slug`, `status`, `created_at`, `updated_at`) VALUES
(1, '1 large double bed', '1-large-double-bed', 1, '2025-04-03 12:03:28', '2025-04-03 12:03:28'),
(2, '2 large double bed', '2-large-double-bed', 1, '2025-04-03 12:03:57', '2025-04-03 12:03:57'),
(3, '1 extra-large double bed', '1-extra-large-double-bed', 1, '2025-04-03 12:07:29', '2025-04-03 12:07:29'),
(4, '2 extra-large double bed', '2-extra-large-double-bed', 1, '2025-04-03 12:17:16', '2025-04-03 12:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `room_id` int(10) UNSIGNED NOT NULL,
  `adult` int(11) DEFAULT 0,
  `child` int(11) DEFAULT 0,
  `room_price` double(10,2) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `arival_from` text DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `paymenttype` int(11) DEFAULT NULL COMMENT '1=online,2=offline',
  `booking_status` int(11) DEFAULT NULL COMMENT '1=Booked\r\n2=Release\r\n3=Cancel',
  `update_by` int(11) DEFAULT NULL,
  `booking_by` int(11) DEFAULT NULL COMMENT 'this admin entry track which user entry',
  `check_out_reason` text DEFAULT NULL,
  `check_out_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_type`
--

CREATE TABLE `booking_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bulk_address`
--

CREATE TABLE `bulk_address` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) DEFAULT NULL,
  `walletAddress` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `block_status` int(11) NOT NULL DEFAULT 0 COMMENT '0=unblock,1=block',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `entry_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recepi_id` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `user_id`, `recepi_id`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(1, 21, 3, 'wow great', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(2, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(6, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(7, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(8, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(10, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(11, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(12, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(13, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(15, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(16, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(17, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(18, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(19, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(20, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(21, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(22, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(23, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(24, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(25, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(26, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(27, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(28, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(29, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(30, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(31, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(32, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38'),
(33, 21, 3, 'wow nice', 1, '2025-05-17 13:37:38', '2025-05-17 13:37:38');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `id` int(11) NOT NULL,
  `shortname` varchar(3) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phonecode` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `shortname`, `name`, `phonecode`, `status`) VALUES
(1, 'AF', 'Afghanistan', 93, 1),
(2, 'AL', 'Albania', 355, 1),
(3, 'DZ', 'Algeria', 213, 1),
(4, 'AS', 'American Samoa', 1684, 1),
(5, 'AD', 'Andorra', 376, 1),
(6, 'AO', 'Angola', 244, 1),
(7, 'AI', 'Anguilla', 1264, 1),
(8, 'AQ', 'Antarctica', 0, 1),
(9, 'AG', 'Antigua And Barbuda', 1268, 1),
(10, 'AR', 'Argentina', 54, 1),
(11, 'AM', 'Armenia', 374, 1),
(12, 'AW', 'Aruba', 297, 1),
(13, 'AU', 'Australia', 61, 1),
(14, 'AT', 'Austria', 43, 1),
(15, 'AZ', 'Azerbaijan', 994, 1),
(16, 'BS', 'Bahamas The', 1242, 1),
(17, 'BH', 'Bahrain', 973, 1),
(18, 'BD', 'Bangladesh', 880, 1),
(19, 'BB', 'Barbados', 1246, 1),
(20, 'BY', 'Belarus', 375, 1),
(21, 'BE', 'Belgium', 32, 1),
(22, 'BZ', 'Belize', 501, 1),
(23, 'BJ', 'Benin', 229, 1),
(24, 'BM', 'Bermuda', 1441, 1),
(25, 'BT', 'Bhutan', 975, 1),
(26, 'BO', 'Bolivia', 591, 1),
(27, 'BA', 'Bosnia and Herzegovina', 387, 1),
(28, 'BW', 'Botswana', 267, 1),
(29, 'BV', 'Bouvet Island', 0, 1),
(30, 'BR', 'Brazil', 55, 1),
(31, 'IO', 'British Indian Ocean Territory', 246, 1),
(32, 'BN', 'Brunei', 673, 1),
(33, 'BG', 'Bulgaria', 359, 1),
(34, 'BF', 'Burkina Faso', 226, 1),
(35, 'BI', 'Burundi', 257, 1),
(36, 'KH', 'Cambodia', 855, 1),
(37, 'CM', 'Cameroon', 237, 1),
(38, 'CA', 'Canada', 1, 1),
(39, 'CV', 'Cape Verde', 238, 1),
(40, 'KY', 'Cayman Islands', 1345, 1),
(41, 'CF', 'Central African Republic', 236, 1),
(42, 'TD', 'Chad', 235, 1),
(43, 'CL', 'Chile', 56, 1),
(44, 'CN', 'China', 86, 1),
(45, 'CX', 'Christmas Island', 61, 1),
(46, 'CC', 'Cocos (Keeling) Islands', 672, 1),
(47, 'CO', 'Colombia', 57, 1),
(48, 'KM', 'Comoros', 269, 1),
(49, 'CG', 'Republic Of The Congo', 242, 1),
(50, 'CD', 'Democratic Republic Of The Congo', 242, 1),
(51, 'CK', 'Cook Islands', 682, 1),
(52, 'CR', 'Costa Rica', 506, 1),
(53, 'CI', 'Cote D\'Ivoire (Ivory Coast)', 225, 1),
(54, 'HR', 'Croatia (Hrvatska)', 385, 1),
(55, 'CU', 'Cuba', 53, 1),
(56, 'CY', 'Cyprus', 357, 1),
(57, 'CZ', 'Czech Republic', 420, 1),
(58, 'DK', 'Denmark', 45, 1),
(59, 'DJ', 'Djibouti', 253, 1),
(60, 'DM', 'Dominica', 1767, 1),
(61, 'DO', 'Dominican Republic', 1809, 1),
(62, 'TP', 'East Timor', 670, 1),
(63, 'EC', 'Ecuador', 593, 1),
(64, 'EG', 'Egypt', 20, 1),
(65, 'SV', 'El Salvador', 503, 1),
(66, 'GQ', 'Equatorial Guinea', 240, 1),
(67, 'ER', 'Eritrea', 291, 1),
(68, 'EE', 'Estonia', 372, 1),
(69, 'ET', 'Ethiopia', 251, 1),
(70, 'XA', 'External Territories of Australia', 61, 1),
(71, 'FK', 'Falkland Islands', 500, 1),
(72, 'FO', 'Faroe Islands', 298, 1),
(73, 'FJ', 'Fiji Islands', 679, 1),
(74, 'FI', 'Finland', 358, 1),
(75, 'FR', 'France', 33, 1),
(76, 'GF', 'French Guiana', 594, 1),
(77, 'PF', 'French Polynesia', 689, 1),
(78, 'TF', 'French Southern Territories', 0, 1),
(79, 'GA', 'Gabon', 241, 1),
(80, 'GM', 'Gambia The', 220, 1),
(81, 'GE', 'Georgia', 995, 1),
(82, 'DE', 'Germany', 49, 1),
(83, 'GH', 'Ghana', 233, 1),
(84, 'GI', 'Gibraltar', 350, 1),
(85, 'GR', 'Greece', 30, 1),
(86, 'GL', 'Greenland', 299, 1),
(87, 'GD', 'Grenada', 1473, 1),
(88, 'GP', 'Guadeloupe', 590, 1),
(89, 'GU', 'Guam', 1671, 1),
(90, 'GT', 'Guatemala', 502, 1),
(91, 'XU', 'Guernsey and Alderney', 44, 1),
(92, 'GN', 'Guinea', 224, 1),
(93, 'GW', 'Guinea-Bissau', 245, 1),
(94, 'GY', 'Guyana', 592, 1),
(95, 'HT', 'Haiti', 509, 1),
(96, 'HM', 'Heard and McDonald Islands', 0, 1),
(97, 'HN', 'Honduras', 504, 1),
(98, 'HK', 'Hong Kong S.A.R.', 852, 1),
(99, 'HU', 'Hungary', 36, 1),
(100, 'IS', 'Iceland', 354, 1),
(101, 'IN', 'India', 91, 1),
(102, 'ID', 'Indonesia', 62, 1),
(103, 'IR', 'Iran', 98, 1),
(104, 'IQ', 'Iraq', 964, 1),
(105, 'IE', 'Ireland', 353, 1),
(106, 'IL', 'Israel', 972, 1),
(107, 'IT', 'Italy', 39, 1),
(108, 'JM', 'Jamaica', 1876, 1),
(109, 'JP', 'Japan', 81, 1),
(110, 'XJ', 'Jersey', 44, 1),
(111, 'JO', 'Jordan', 962, 1),
(112, 'KZ', 'Kazakhstan', 7, 1),
(113, 'KE', 'Kenya', 254, 1),
(114, 'KI', 'Kiribati', 686, 1),
(115, 'KP', 'Korea North', 850, 1),
(116, 'KR', 'Korea South', 82, 1),
(117, 'KW', 'Kuwait', 965, 1),
(118, 'KG', 'Kyrgyzstan', 996, 1),
(119, 'LA', 'Laos', 856, 1),
(120, 'LV', 'Latvia', 371, 1),
(121, 'LB', 'Lebanon', 961, 1),
(122, 'LS', 'Lesotho', 266, 1),
(123, 'LR', 'Liberia', 231, 1),
(124, 'LY', 'Libya', 218, 1),
(125, 'LI', 'Liechtenstein', 423, 1),
(126, 'LT', 'Lithuania', 370, 1),
(127, 'LU', 'Luxembourg', 352, 1),
(128, 'MO', 'Macau S.A.R.', 853, 1),
(129, 'MK', 'Macedonia', 389, 1),
(130, 'MG', 'Madagascar', 261, 1),
(131, 'MW', 'Malawi', 265, 1),
(132, 'MY', 'Malaysia', 60, 1),
(133, 'MV', 'Maldives', 960, 1),
(134, 'ML', 'Mali', 223, 1),
(135, 'MT', 'Malta', 356, 1),
(136, 'XM', 'Man (Isle of)', 44, 1),
(137, 'MH', 'Marshall Islands', 692, 1),
(138, 'MQ', 'Martinique', 596, 1),
(139, 'MR', 'Mauritania', 222, 1),
(140, 'MU', 'Mauritius', 230, 1),
(141, 'YT', 'Mayotte', 269, 1),
(142, 'MX', 'Mexico', 52, 1),
(143, 'FM', 'Micronesia', 691, 1),
(144, 'MD', 'Moldova', 373, 1),
(145, 'MC', 'Monaco', 377, 1),
(146, 'MN', 'Mongolia', 976, 1),
(147, 'MS', 'Montserrat', 1664, 1),
(148, 'MA', 'Morocco', 212, 1),
(149, 'MZ', 'Mozambique', 258, 1),
(150, 'MM', 'Myanmar', 95, 1),
(151, 'NA', 'Namibia', 264, 1),
(152, 'NR', 'Nauru', 674, 1),
(153, 'NP', 'Nepal', 977, 1),
(154, 'AN', 'Netherlands Antilles', 599, 1),
(155, 'NL', 'Netherlands The', 31, 1),
(156, 'NC', 'New Caledonia', 687, 1),
(157, 'NZ', 'New Zealand', 64, 1),
(158, 'NI', 'Nicaragua', 505, 1),
(159, 'NE', 'Niger', 227, 1),
(160, 'NG', 'Nigeria', 234, 1),
(161, 'NU', 'Niue', 683, 1),
(162, 'NF', 'Norfolk Island', 672, 1),
(163, 'MP', 'Northern Mariana Islands', 1670, 1),
(164, 'NO', 'Norway', 47, 1),
(165, 'OM', 'Oman', 968, 1),
(166, 'PK', 'Pakistan', 92, 1),
(167, 'PW', 'Palau', 680, 1),
(168, 'PS', 'Palestinian Territory Occupied', 970, 1),
(169, 'PA', 'Panama', 507, 1),
(170, 'PG', 'Papua new Guinea', 675, 1),
(171, 'PY', 'Paraguay', 595, 1),
(172, 'PE', 'Peru', 51, 1),
(173, 'PH', 'Philippines', 63, 1),
(174, 'PN', 'Pitcairn Island', 0, 1),
(175, 'PL', 'Poland', 48, 1),
(176, 'PT', 'Portugal', 351, 1),
(177, 'PR', 'Puerto Rico', 1787, 1),
(178, 'QA', 'Qatar', 974, 1),
(179, 'RE', 'Reunion', 262, 1),
(180, 'RO', 'Romania', 40, 1),
(181, 'RU', 'Russia', 70, 1),
(182, 'RW', 'Rwanda', 250, 1),
(183, 'SH', 'Saint Helena', 290, 1),
(184, 'KN', 'Saint Kitts And Nevis', 1869, 1),
(185, 'LC', 'Saint Lucia', 1758, 1),
(186, 'PM', 'Saint Pierre and Miquelon', 508, 1),
(187, 'VC', 'Saint Vincent And The Grenadines', 1784, 1),
(188, 'WS', 'Samoa', 684, 1),
(189, 'SM', 'San Marino', 378, 1),
(190, 'ST', 'Sao Tome and Principe', 239, 1),
(191, 'SA', 'Saudi Arabia', 966, 1),
(192, 'SN', 'Senegal', 221, 1),
(193, 'RS', 'Serbia', 381, 1),
(194, 'SC', 'Seychelles', 248, 1),
(195, 'SL', 'Sierra Leone', 232, 1),
(196, 'SG', 'Singapore', 65, 1),
(197, 'SK', 'Slovakia', 421, 1),
(198, 'SI', 'Slovenia', 386, 1),
(199, 'XG', 'Smaller Territories of the UK', 44, 1),
(200, 'SB', 'Solomon Islands', 677, 1),
(201, 'SO', 'Somalia', 252, 1),
(202, 'ZA', 'South Africa', 27, 1),
(203, 'GS', 'South Georgia', 0, 1),
(204, 'SS', 'South Sudan', 211, 1),
(205, 'ES', 'Spain', 34, 1),
(206, 'LK', 'Sri Lanka', 94, 1),
(207, 'SD', 'Sudan', 249, 1),
(208, 'SR', 'Suriname', 597, 1),
(209, 'SJ', 'Svalbard And Jan Mayen Islands', 47, 1),
(210, 'SZ', 'Swaziland', 268, 1),
(211, 'SE', 'Sweden', 46, 1),
(212, 'CH', 'Switzerland', 41, 1),
(213, 'SY', 'Syria', 963, 1),
(214, 'TW', 'Taiwan', 886, 1),
(215, 'TJ', 'Tajikistan', 992, 1),
(216, 'TZ', 'Tanzania', 255, 1),
(217, 'TH', 'Thailand', 66, 1),
(218, 'TG', 'Togo', 228, 1),
(219, 'TK', 'Tokelau', 690, 1),
(220, 'TO', 'Tonga', 676, 1),
(221, 'TT', 'Trinidad And Tobago', 1868, 1),
(222, 'TN', 'Tunisia', 216, 1),
(223, 'TR', 'Turkey', 90, 1),
(224, 'TM', 'Turkmenistan', 7370, 1),
(225, 'TC', 'Turks And Caicos Islands', 1649, 1),
(226, 'TV', 'Tuvalu', 688, 1),
(227, 'UG', 'Uganda', 256, 1),
(228, 'UA', 'Ukraine', 380, 1),
(229, 'AE', 'United Arab Emirates', 971, 1),
(230, 'GB', 'United Kingdom', 44, 1),
(231, 'US', 'United States', 1, 1),
(232, 'UM', 'United States Minor Outlying Islands', 1, 1),
(233, 'UY', 'Uruguay', 598, 1),
(234, 'UZ', 'Uzbekistan', 998, 1),
(235, 'VU', 'Vanuatu', 678, 1),
(236, 'VA', 'Vatican City State (Holy See)', 39, 1),
(237, 'VE', 'Venezuela', 58, 1),
(238, 'VN', 'Vietnam', 84, 1),
(239, 'VG', 'Virgin Islands (British)', 1284, 1),
(240, 'VI', 'Virgin Islands (US)', 1340, 1),
(241, 'WF', 'Wallis And Futuna Islands', 681, 1),
(242, 'EH', 'Western Sahara', 212, 1),
(243, 'YE', 'Yemen', 967, 1),
(244, 'YU', 'Yugoslavia', 38, 1),
(245, 'ZM', 'Zambia', 260, 1),
(246, 'ZW', 'Zimbabwe', 263, 1);

-- --------------------------------------------------------

--
-- Table structure for table `currency_type`
--

CREATE TABLE `currency_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currency_type`
--

INSERT INTO `currency_type` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'USDT-TRC20-TRX', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(2, 'USDT-ERC20', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(3, 'USDT-OMNI', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(4, 'BTC', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(5, 'LTC', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(6, 'ETH', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(7, 'TRX', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11'),
(8, 'ADA', 1, '2024-03-21 19:13:11', '2024-03-21 19:13:11');

-- --------------------------------------------------------

--
-- Table structure for table `deposit_request`
--

CREATE TABLE `deposit_request` (
  `id` int(11) NOT NULL,
  `depositID` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `merchant_id` int(11) DEFAULT NULL,
  `deposit_amount` double(10,2) DEFAULT NULL,
  `receivable_amount` double(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `to_crypto_wallet_address` varchar(255) DEFAULT NULL,
  `trxId` varchar(255) DEFAULT NULL,
  `depscription` text DEFAULT NULL,
  `wallet_address` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT '0=Review,2=Reject,1=Approved',
  `approved_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deposit_request`
--

INSERT INTO `deposit_request` (`id`, `depositID`, `user_id`, `merchant_id`, `deposit_amount`, `receivable_amount`, `payment_method`, `to_crypto_wallet_address`, `trxId`, `depscription`, `wallet_address`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES
(1, 'DEPOSIT.0127b06252935c330e9f23651b398ce4', 6, 3, 600.00, NULL, NULL, 'B8gYf7P0Wm0X7F2T9hQ0J3y1b8g0d6m9oG', NULL, NULL, NULL, 0, NULL, '2025-01-16 02:41:56', '2025-01-16 02:41:56'),
(2, 'DEPOSIT.7e8750d4a701596732953c160d2ae096', 6, 3, 1050.00, NULL, NULL, 'X9F0t2b7m0Q3Z8d9gY6L2J1V5n3H6p0W2', NULL, NULL, NULL, 0, NULL, '2025-01-16 02:50:33', '2025-01-16 02:50:33'),
(3, 'DEPOSIT.c4de8ced6214345614d33fb0b16a8acd', 6, 3, 650.00, NULL, NULL, '7gMr8zP2XkS4tD5nJ1p5V1Hq9bR4G9x0o', NULL, NULL, NULL, 0, NULL, '2025-01-16 04:29:27', '2025-01-16 04:29:27');

-- --------------------------------------------------------

--
-- Table structure for table `facility_group`
--

CREATE TABLE `facility_group` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_wallet_address`
--

CREATE TABLE `global_wallet_address` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `lock_unlock` int(11) NOT NULL COMMENT '1=lock,0=unlock',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` text NOT NULL,
  `attempts` int(10) UNSIGNED DEFAULT 0,
  `reserved_at` timestamp NULL DEFAULT NULL,
  `available_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'English', 'en', 1, '2024-10-26 11:34:03', '2024-10-26 11:34:03'),
(2, 'Bengali', 'bn', 1, '2024-10-26 11:34:03', '2024-10-27 06:00:00'),
(3, 'Hindi', 'hi', 0, '2024-10-26 11:34:03', '2024-10-26 11:34:03'),
(4, 'Tamil', 'ta', 0, '2024-10-26 11:34:03', '2024-10-27 10:16:45'),
(5, 'Chinese', 'zh', 0, '2024-10-26 11:34:03', '2024-10-27 11:10:21'),
(6, 'Spanish', 'es', 0, '2024-10-26 11:34:03', '2024-10-26 11:34:03');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `method` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merchant_request`
--

CREATE TABLE `merchant_request` (
  `id` int(10) UNSIGNED NOT NULL,
  `api_key_id` int(10) UNSIGNED NOT NULL,
  `merchant_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) DEFAULT 0 COMMENT '1=approved\r\n0=not approved',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 2),
(3, '2019_08_19_000000_create_failed_jobs_table', 3),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `created_at`) VALUES
(1, 'gazigiashuddin@gmail.com', 'cBk8LmFh6xfydQ2ao78Qznbj4XtNcPMSJRlNxSUePN07sEr9Vg2yCl3Ou9Y9', '2024-07-11 17:39:05'),
(2, 'gazigiashuddin@gmail.com', 'mhEUCcET2u0JHkrS9srpcahx1Uz9g7D4AcohXUW4VutHE5qiNw73Ozjifyi4', '2024-07-11 17:44:39');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `post_category_id` int(11) DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `thumnail_img` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE `post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_category`
--

INSERT INTO `post_category` (`id`, `name`, `slug`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sweets', 'sweets', 1, '2025-05-16 14:12:06', '2025-05-16 14:12:06'),
(2, 'Burger ', 'burger ', 1, '2025-05-16 14:12:06', '2025-05-16 14:12:06'),
(3, 'Drinks ', 'drinks ', 1, '2025-05-16 14:12:06', '2025-05-16 14:12:06'),
(4, 'Pizza', 'pizza', 1, '2025-05-16 14:12:06', '2025-05-16 14:12:06');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recepi_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`id`, `user_id`, `recepi_id`, `created_at`, `updated_at`) VALUES
(1, 21, 3, '2025-05-17 13:37:28', '2025-05-17 13:37:28'),
(2, 22, 3, '2025-05-17 13:37:28', '2025-05-17 13:37:28');

-- --------------------------------------------------------

--
-- Table structure for table `promocode`
--

CREATE TABLE `promocode` (
  `id` bigint(20) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `form_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `promoCode` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promocode`
--

INSERT INTO `promocode` (`id`, `room_id`, `form_date`, `to_date`, `discount`, `promoCode`, `status`, `created_at`, `updated_at`) VALUES
(1, 7, '2025-03-12', '2025-03-15', 500.00, 'BEFO-488', 1, '2025-04-01 13:20:55', '2025-04-01 13:20:55'),
(2, 5, '2025-04-07', '2025-04-17', 5366.00, 'BEFO-4882', 1, '2025-04-01 13:26:03', '2025-04-01 14:33:07'),
(3, 1, '2025-04-01', '2025-04-15', 33.00, 'BEFO-488233', 1, '2025-04-01 13:27:03', '2025-04-01 13:27:03');

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

CREATE TABLE `recipe` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `cuisine` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `servings` varchar(255) DEFAULT NULL,
  `preparation_time` varchar(255) DEFAULT NULL,
  `cooking_time` varchar(255) DEFAULT NULL,
  `calories` varchar(255) DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `upateby` int(11) DEFAULT NULL,
  `thumnail_img` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`id`, `name`, `slug`, `description`, `ingredients`, `category_id`, `cuisine`, `difficulty`, `servings`, `preparation_time`, `cooking_time`, `calories`, `entry_by`, `upateby`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Mouthwatering Caprese Skewers', 'mouthwatering-caprese-skewers', 'These Mouthwatering Caprese Skewers are a fresh, simple, and elegant appetizer perfect for any occasion. Combining juicy cherry tomatoes, creamy mozzarella balls, and fragrant fresh basil leaves, drizzled with a balsamic glaze, these skewers burst with vibrant flavors and colors. They’re easy to make, visually appealing, and a guaranteed crowd-pleaser that brings the classic Caprese salad to a convenient bite-sized form.', 'Cherry tomatoes (about 20)\r\nFresh mozzarella balls (bocconcini or ciliegine, about 20)\r\nFresh basil leaves (20-25 leaves)\r\nExtra virgin olive oil (2-3 tablespoons)\r\nBalsamic glaze or balsamic reduction (for drizzling)\r\nSalt and freshly ground black pepper (to taste)\r\nWooden or bamboo skewers (about 10)', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, NULL, '/backend/files/3OaofDc089bQDocfcHQj.jpg', 1, '2025-05-17 13:35:32', '2025-05-17 13:35:32'),
(3, 'Spicy Buffalo Cauliflower Bites', 'spicy-buffalo-cauliflower-bites', 'Spicy Buffalo Cauliflower Bites are a delicious, crispy, and healthy twist on traditional buffalo wings. Perfectly battered and baked to golden perfection, these cauliflower florets are tossed in a bold and tangy buffalo sauce that packs just the right amount of heat. Ideal as a snack, appetizer, or game-day treat, they offer all the flavor of buffalo wings without the meat — making them a great option for vegetarians and anyone craving a flavorful bite!', '1 medium head of cauliflower, cut into bite-sized florets\r\n1 cup all-purpose flour (or a gluten-free alternative)\r\n1 cup water (or unsweetened almond milk for dairy-free)\r\n1 tsp garlic powder\r\n1 tsp onion powder\r\n½ tsp smoked paprika\r\nSalt and pepper, to taste\r\n½ cup buffalo hot sauce (like Frank’s RedHot)\r\n2 tbsp melted vegan butter or regular butter\r\nOptional: celery sticks and ranch or blue cheese dressing for serving', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, NULL, '/backend/files/7gie5i2OUmWg4F7ahS64.jpg', 1, '2025-05-17 13:36:44', '2025-05-17 13:36:44'),
(4, 'Spicy Buffalo Cauliflower Bites', 'spicy-buffalo-cauliflower-bites', 'Spicy Buffalo Cauliflower Bites are a delicious, crispy, and healthy twist on traditional buffalo wings. Perfectly battered and baked to golden perfection, these cauliflower florets are tossed in a bold and tangy buffalo sauce that packs just the right amount of heat. Ideal as a snack, appetizer, or game-day treat, they offer all the flavor of buffalo wings without the meat — making them a great option for vegetarians and anyone craving a flavorful bite!', '1 medium head of cauliflower, cut into bite-sized florets\r\n1 cup all-purpose flour (or a gluten-free alternative)\r\n1 cup water (or unsweetened almond milk for dairy-free)\r\n1 tsp garlic powder\r\n1 tsp onion powder\r\n½ tsp smoked paprika\r\nSalt and pepper, to taste\r\n½ cup buffalo hot sauce (like Frank’s RedHot)\r\n2 tbsp melted vegan butter or regular butter\r\nOptional: celery sticks and ranch or blue cheese dressing for serving', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, NULL, '/backend/files/7gie5i2OUmWg4F7ahS64.jpg', 1, '2025-05-17 13:36:44', '2025-05-17 13:36:44'),
(5, 'Spicy Buffalo Cauliflower Bites', 'spicy-buffalo-cauliflower-bites', 'Spicy Buffalo Cauliflower Bites are a delicious, crispy, and healthy twist on traditional buffalo wings. Perfectly battered and baked to golden perfection, these cauliflower florets are tossed in a bold and tangy buffalo sauce that packs just the right amount of heat. Ideal as a snack, appetizer, or game-day treat, they offer all the flavor of buffalo wings without the meat — making them a great option for vegetarians and anyone craving a flavorful bite!', '1 medium head of cauliflower, cut into bite-sized florets\r\n1 cup all-purpose flour (or a gluten-free alternative)\r\n1 cup water (or unsweetened almond milk for dairy-free)\r\n1 tsp garlic powder\r\n1 tsp onion powder\r\n½ tsp smoked paprika\r\nSalt and pepper, to taste\r\n½ cup buffalo hot sauce (like Frank’s RedHot)\r\n2 tbsp melted vegan butter or regular butter\r\nOptional: celery sticks and ranch or blue cheese dressing for serving', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, NULL, '/backend/files/7gie5i2OUmWg4F7ahS64.jpg', 1, '2025-05-17 13:36:44', '2025-05-17 13:36:44'),
(6, 'Spicy Buffalo Cauliflower Bites', 'spicy-buffalo-cauliflower-bites', 'Spicy Buffalo Cauliflower Bites are a delicious, crispy, and healthy twist on traditional buffalo wings. Perfectly battered and baked to golden perfection, these cauliflower florets are tossed in a bold and tangy buffalo sauce that packs just the right amount of heat. Ideal as a snack, appetizer, or game-day treat, they offer all the flavor of buffalo wings without the meat — making them a great option for vegetarians and anyone craving a flavorful bite!', '1 medium head of cauliflower, cut into bite-sized florets\r\n1 cup all-purpose flour (or a gluten-free alternative)\r\n1 cup water (or unsweetened almond milk for dairy-free)\r\n1 tsp garlic powder\r\n1 tsp onion powder\r\n½ tsp smoked paprika\r\nSalt and pepper, to taste\r\n½ cup buffalo hot sauce (like Frank’s RedHot)\r\n2 tbsp melted vegan butter or regular butter\r\nOptional: celery sticks and ranch or blue cheese dressing for serving', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, NULL, '/backend/files/7gie5i2OUmWg4F7ahS64.jpg', 1, '2025-05-17 13:36:44', '2025-05-17 13:36:44'),
(7, 'Spicy Buffalo Cauliflower Bites', 'spicy-buffalo-cauliflower-bites-2', 'Spicy Buffalo Cauliflower Bites are a delicious, crispy, and healthy twist on traditional buffalo wings. Perfectly battered and baked to golden perfection, these cauliflower florets are tossed in a bold and tangy buffalo sauce that packs just the right amount of heat. Ideal as a snack, appetizer, or game-day treat, they offer all the flavor of buffalo wings without the meat — making them a great option for vegetarians and anyone craving a flavorful bite!', '1 medium head of cauliflower, cut into bite-sized florets\r\n1 cup all-purpose flour (or a gluten-free alternative)\r\n1 cup water (or unsweetened almond milk for dairy-free)\r\n1 tsp garlic powder\r\n1 tsp onion powder\r\n½ tsp smoked paprika\r\nSalt and pepper, to taste\r\n½ cup buffalo hot sauce (like Frank’s RedHot)\r\n2 tbsp melted vegan butter or regular butter\r\nOptional: celery sticks and ranch or blue cheese dressing for serving', 2, 'Cuisine', 'Difficulty', '4 Servings', '30 min', '45 min', '600', 21, 1, '/backend/files/7gie5i2OUmWg4F7ahS64.jpg', 1, '2025-05-17 13:36:44', '2025-05-17 16:47:39');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `roomType` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `extraCapacity` varchar(255) DEFAULT NULL COMMENT 'extraCapability',
  `roomPrice` decimal(10,2) DEFAULT NULL,
  `bedCharge` int(11) DEFAULT NULL,
  `room_size_id` int(11) DEFAULT NULL,
  `bedNumber` varchar(255) DEFAULT NULL,
  `bed_type_id` int(11) DEFAULT NULL,
  `roomDescription` text DEFAULT NULL,
  `reserveCondition` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `booking_status` int(11) DEFAULT NULL COMMENT '1=Booked 2=Release 3=Cancel',
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_facility`
--

CREATE TABLE `room_facility` (
  `id` bigint(20) NOT NULL,
  `room_facility_group_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_images`
--

CREATE TABLE `room_images` (
  `id` bigint(20) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `roomImage` varchar(255) DEFAULT NULL,
  `roomImgDescription` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_size`
--

CREATE TABLE `room_size` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rule`
--

CREATE TABLE `rule` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rule`
--

INSERT INTO `rule` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 1, '2024-04-16 10:33:46', '2024-04-16 10:33:46'),
(2, 'Customer', 0, '2024-04-16 10:56:15', '2024-04-16 10:56:15'),
(3, 'Admin', 0, '2024-04-16 10:56:27', '2024-12-06 12:43:05'),
(4, 'User', 1, '2024-04-16 10:56:27', '2024-12-06 12:43:05');

-- --------------------------------------------------------

--
-- Table structure for table `select_room_facilities`
--

CREATE TABLE `select_room_facilities` (
  `id` bigint(20) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `room_facility_group_id` int(11) DEFAULT NULL,
  `facilities_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` mediumtext NOT NULL,
  `whatsApp` varchar(255) NOT NULL,
  `about_us` mediumtext NOT NULL,
  `copyright` varchar(255) NOT NULL,
  `fblink` varchar(255) DEFAULT NULL,
  `twitterlink` varchar(255) DEFAULT NULL,
  `linkdinlink` varchar(255) DEFAULT NULL,
  `instragramlink` varchar(255) DEFAULT NULL,
  `slugan` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `youtubelink` varchar(255) DEFAULT NULL,
  `update_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `name`, `email`, `address`, `whatsApp`, `about_us`, `copyright`, `fblink`, `twitterlink`, `linkdinlink`, `instragramlink`, `slugan`, `banner_image`, `youtubelink`, `update_by`, `created_at`, `updated_at`) VALUES
(1, 'Recipes', 'recipes@world.com', 'Pechardwip, Cox\'s Bazar, Bangladesh', '+8801830330055', 'Welcome to our recipe haven—where passion for food meets creativity in the kitchen! Our recipe business is dedicated to helping food lovers, home cooks, and aspiring chefs discover the joy of cooking delicious meals with confidence and ease. Whether you\'re looking to master the basics or explore new culinary horizons, we have something for everyone.\r\n\r\nOur extensive collection features a wide range of recipes, from traditional family favorites to trendy, modern dishes. We understand that every cook has different needs, so we offer recipes for all skill levels—from quick and easy meals for busy weeknights to impressive dishes for special occasions. Whether you crave comforting soups, sizzling grills, decadent desserts, or healthy vegetarian meals, you’ll find just the right recipe to satisfy your taste.\r\n\r\nEach of our recipes is crafted with care and tested to ensure success in your kitchen. We provide step-by-step instructions, cooking tips, and ingredient substitutions to make your cooking experience stress-free and enjoyable. We believe that cooking should not only be practical but also creative and fun, so we encourage personalization and experimenting with flavors to make each recipe your own.\r\n\r\nBeyond recipes, we also share cooking hacks, nutritional insights, and seasonal meal plans to help you stay organized and inspired throughout the year. Our goal is to build a community of food lovers who can learn, share, and grow together through the magic of homemade meals.\r\n\r\nWe are also committed to using fresh, accessible ingredients that reflect both local and global flavors. Our recipes are designed to be realistic and budget-friendly, so you don’t need fancy tools or hard-to-find ingredients to make something amazing.\r\n\r\nWhether you’re cooking for one, feeding a family, or entertaining guests, our platform is here to guide you with confidence and creativity. Explore our library, try something new, and most importantly—enjoy the process of making something with your own hands.\r\n\r\nThank you for being part of our journey. Let\'s cook, learn, and grow together—one delicious recipe at a time!', 'All Right Reserved.Designed By Moon Nest', 'https://www.facebook.com/', NULL, NULL, '#', 'Recipes world', '/backend/files/qXV8QBkxJJGosb7Rdzqv.jpg', 'https://www.youtube.com/', NULL, '2024-05-12 05:32:50', '2025-05-17 12:00:41');

-- --------------------------------------------------------

--
-- Table structure for table `slider_images`
--

CREATE TABLE `slider_images` (
  `id` bigint(20) NOT NULL,
  `title_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sliderImage` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slider_images`
--

INSERT INTO `slider_images` (`id`, `title_name`, `description`, `sliderImage`, `status`, `created_at`, `updated_at`) VALUES
(4, 'Spinach and Feta Egg Muffins', 'There are many variations of passages, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even..', '/backend/files/3UaQs8OEUlDLxRbKqmE7.png', 1, '2025-05-17 19:04:57', '2025-05-17 19:04:57');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `country_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fg_id` varchar(255) DEFAULT NULL,
  `fg_wallet_address` varchar(255) DEFAULT NULL,
  `inviteCode` varchar(255) DEFAULT NULL,
  `ref_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL COMMENT '1=Supper admin, 2=Customer, 3=Admin, 4=User',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `available_balance` double(10,8) DEFAULT NULL,
  `show_password` varchar(225) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `real_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(225) DEFAULT NULL,
  `image` varchar(225) DEFAULT NULL,
  `doc_file` varchar(255) DEFAULT NULL,
  `address` varchar(225) DEFAULT NULL,
  `address_1` varchar(255) DEFAULT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `website` varchar(225) DEFAULT NULL,
  `github` varchar(225) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `twitter` varchar(225) DEFAULT NULL,
  `instagram` varchar(225) DEFAULT NULL,
  `nationality_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `otp` int(11) DEFAULT NULL,
  `facebook` varchar(225) DEFAULT NULL,
  `wallet_balance` decimal(10,2) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `whtsapp` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `register_ip` varchar(255) DEFAULT NULL,
  `lastlogin_ip` varchar(255) DEFAULT NULL,
  `lastlogin_country` varchar(255) DEFAULT NULL,
  `lastlogin_datetime` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `status` int(11) DEFAULT 0,
  `logged_out` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fg_id`, `fg_wallet_address`, `inviteCode`, `ref_id`, `employee_id`, `company_name`, `role_id`, `name`, `email`, `username`, `phone`, `available_balance`, `show_password`, `password`, `real_name`, `phone_number`, `image`, `doc_file`, `address`, `address_1`, `address_2`, `website`, `github`, `gender`, `date_of_birth`, `twitter`, `instagram`, `nationality_id`, `state_id`, `otp`, `facebook`, `wallet_balance`, `email_verified_at`, `telegram`, `whtsapp`, `remember_token`, `entry_by`, `register_ip`, `lastlogin_ip`, `lastlogin_country`, `lastlogin_datetime`, `created_at`, `updated_at`, `status`, `logged_out`) VALUES
(1, NULL, '6f21357fs863ce24ce21c1a82f49a7d5d13', '0000123', 0, 4, 'FG IT', 1, 'Black jons', 'dev1@mail.com', 'dev', '019155555', NULL, 'dev', '$2y$10$egNt4iHOZ4sWab8IcaHE9..QCyQc3z4oFRYUwesyeTH52KDFzM5.y', NULL, '01915728982', '/backend/files/hZkagctUSINKsFU64UJr.png', NULL, 'Dhaka', '', '', 'http://localhost:3000/profile', 'http://localhost:3000/profile', '', '1982-01-30', 'http://localhost:3000/profile', 'http://localhost:3000/profile', 0, 0, NULL, 'http://localhost:3000/profile', NULL, NULL, NULL, NULL, NULL, 1, NULL, '127.0.0.1', NULL, '2024-11-22 09:50:10', '2023-06-22 03:20:43', '2025-04-15 02:56:37', 1, NULL),
(2, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'Ibraheem', '12ibraheem@gmail.com', '4888', '045878787888', NULL, 'Ibraheem', '$2y$10$xD8SNrVUclcpYXMtzfx9OeMz98V4bTDYQG/0OwYS.xFv1rwMnufWC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2025-04-12 04:01:49', '2025-04-12 04:01:56', 1, NULL),
(21, 'FG000000021', '6537aff00a10a37930603165a2da53f4', '4396747', 2, NULL, NULL, 4, 'limaahmed', 'limaahmed@gmail.com', 'limaahmed123', NULL, NULL, 'limaahmed123', '$2y$10$KOVa2An1QDB0dQCNBKTWJOrGFc3J970QsCnH0ZDjw7rwRJ.7I3/nC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '127.0.0.1', NULL, NULL, NULL, '2025-05-17 13:27:19', '2025-05-17 13:27:19', 1, NULL),
(22, 'FG000000022', '8e3c461a604cc05851d6461b764ff56d', '3091902', 2, NULL, NULL, 4, 'ayeshabegum', 'ayeshabegum@gmail.com', 'ayesha123', '00168989899', NULL, 'ayesha123', '$2y$10$34hfhCBRZHoZM2xL3HGSKOSGGgeK0OSKX3Jmh8J0ZS13CAEe4ZTX6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '127.0.0.1', NULL, NULL, NULL, '2025-05-17 13:41:49', '2025-05-17 13:42:41', 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_configs`
--
ALTER TABLE `api_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_code_unique` (`app_id`);

--
-- Indexes for table `api_key`
--
ALTER TABLE `api_key`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bed_type`
--
ALTER TABLE `bed_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`),
  ADD KEY `idx_room_id` (`room_id`),
  ADD KEY `idx_customer_id` (`customer_id`);

--
-- Indexes for table `booking_type`
--
ALTER TABLE `booking_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bulk_address`
--
ALTER TABLE `bulk_address`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `walletAddress` (`walletAddress`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currency_type`
--
ALTER TABLE `currency_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposit_request`
--
ALTER TABLE `deposit_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facility_group`
--
ALTER TABLE `facility_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `global_wallet_address`
--
ALTER TABLE `global_wallet_address`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `merchant_request`
--
ALTER TABLE `merchant_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promocode`
--
ALTER TABLE `promocode`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_facility`
--
ALTER TABLE `room_facility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_size`
--
ALTER TABLE `room_size`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rule`
--
ALTER TABLE `rule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `select_room_facilities`
--
ALTER TABLE `select_room_facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slider_images`
--
ALTER TABLE `slider_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `fg_wallet_address` (`fg_wallet_address`),
  ADD UNIQUE KEY `fg_id` (`fg_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_configs`
--
ALTER TABLE `api_configs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `api_key`
--
ALTER TABLE `api_key`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `bed_type`
--
ALTER TABLE `bed_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_type`
--
ALTER TABLE `booking_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bulk_address`
--
ALTER TABLE `bulk_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=247;

--
-- AUTO_INCREMENT for table `currency_type`
--
ALTER TABLE `currency_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `deposit_request`
--
ALTER TABLE `deposit_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `facility_group`
--
ALTER TABLE `facility_group`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_wallet_address`
--
ALTER TABLE `global_wallet_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `merchant_request`
--
ALTER TABLE `merchant_request`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_category`
--
ALTER TABLE `post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `promocode`
--
ALTER TABLE `promocode`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recipe`
--
ALTER TABLE `recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_facility`
--
ALTER TABLE `room_facility`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_images`
--
ALTER TABLE `room_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_size`
--
ALTER TABLE `room_size`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rule`
--
ALTER TABLE `rule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `select_room_facilities`
--
ALTER TABLE `select_room_facilities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `slider_images`
--
ALTER TABLE `slider_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
