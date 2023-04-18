-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2022 at 11:49 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `card_history`
--

CREATE TABLE `card_history` (
  `card_no` varchar(20) NOT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `action_type` varchar(10) NOT NULL,
  `ato` varchar(82) NOT NULL,
  `passengeruser_id` varchar(20) DEFAULT NULL,
  `passengeremail` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `complaint_id` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` text NOT NULL,
  `message` varchar(255) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(2) NOT NULL,
  `rto` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`complaint_id`, `name`, `email`, `contact`, `message`, `time`, `status`, `rto`) VALUES
('c1@25072022', 'Ram', 'ram.334@gmail.co', '9854255216', 'How to get new Smart Card ?', '2022-07-25 19:20:22', 0, 'WB20'),
('c2@25072022', 'Nolok', 'nlk@rediffmail.co', '8545112355', 'Where to contact for the Smart Card Top-up?', '2022-07-25 19:20:37', 0, 'WB20');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(20) NOT NULL,
  `ssid` varchar(30) NOT NULL,
  `lat_long` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `ssid`, `lat_long`) VALUES
(1, 'wifi_B', '22.240851, 88.372057'),
(2, 'TP-Link_C97E', '22.266609, 88.355148'),
(3, 'wifi_U', '22.236736, 88.272722'),
(4, 'wifi_P', '22.630959, 88.433893'),
(5, 'wifi_S', '22.565491, 88.383010'),
(6, 'Ext_TP-Link_C97E', '22.540707, 88.335264');

-- --------------------------------------------------------

--
-- Table structure for table `officer`
--

CREATE TABLE `officer` (
  `id_no` int(5) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `designation` varchar(30) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact` varchar(10) NOT NULL,
  `rto_id` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `officer`
--

INSERT INTO `officer` (`id_no`, `user_id`, `password`, `name`, `designation`, `email`, `contact`, `rto_id`) VALUES
(1, 'officer1', '$2a$08$p9n9Qsph9bJgsmxlceA2uuOlxhg4lCuEhvajhd2.x4C3NinJ5W2gO', 'Parna Mondal', 'RTO Operator', 'officer@mail.co', '856856265', 'WB20');

-- --------------------------------------------------------

--
-- Table structure for table `passenger`
--

CREATE TABLE `passenger` (
  `id_no` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `card_no` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `pob` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `pincode` int(10) NOT NULL,
  `id_type` varchar(20) NOT NULL,
  `id_num` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(10) NOT NULL,
  `rto_id` varchar(6) NOT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `passenger`
--

INSERT INTO `passenger` (`id_no`, `user_id`, `password`, `card_no`, `name`, `dob`, `pob`, `address`, `pincode`, `id_type`, `id_num`, `email`, `contact`, `rto_id`, `status`) VALUES
(1, 'tester1', '$2a$08$GbxBVEF/N/kkAygVbT5PxeXKl4f6adzMDgGiIDj/RR34olAu.oNOy', 'B94ED5D0', 'Amit Kr. Sah', '2000-08-20', 'Bihar', 'Kolkata', 854823, 'Election ID', 'NYH51502', 'test1@mail.co', '9546387910', 'WB24', 0),
(2, 'tester2', '$2a$08$impiMxSHapmZY8Q1fGZjteKmXMFGrIPb.eyJQmR6n9NyiGZni0REm', 'D91E13CC', 'Upalabdhi Ghatak', '2001-12-31', 'Catt.', 'Kolkata', 819765, 'Election ID', 'NHYK3357', 'test2@mail.co', '9546738492', 'WB20', 1),
(3, 'user1', '$2a$08$tnH9rSTNO1NfBBUYOBHQjePoEE2xUVUxr/UTOeTNnFvpG3o.ELKOa', '59B5D9D0', 'B S Mondal', '2001-02-28', 'Kuldia', 'Kuldia, Mograhat, South 24 PGS', 745618, 'Aadhar', '6356 1403 2295', 'test5@mail.co', '6295432102', 'WB20', -1),
(4, 'user2', '$2a$08$Ya5UqvWo0qMHYwc/ejIl5ujrTpmr8VeasO57SsGcvhB3GtswChsw6', '2BB3014F', 'Arindam Mondal', '2001-01-10', 'Catt.', 'Dum Dum', 754321, 'Election', 'NHY43357', 'user2@mail.co', '8254912768', 'WB20', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rto`
--

CREATE TABLE `rto` (
  `rto_id` varchar(8) NOT NULL,
  `rto_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rto`
--

INSERT INTO `rto` (`rto_id`, `rto_name`) VALUES
('WB11', 'Howrah'),
('WB15', 'Hooghly'),
('WB19', 'Alipore'),
('WB20', 'South 24 PGS'),
('WB24', 'Barrackpore'),
('WB25', 'Barasat'),
('WB28', 'Bangaon'),
('WB37', 'Asansol'),
('WB47', 'Bolpur'),
('WB61', 'Balurghat'),
('WB63', 'Cooch Behar'),
('WB76', 'Darjeeling'),
('WB95', 'Baruipur'),
('WB97', 'Diamond Harbour');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone_no` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone_no`) VALUES
(1, 'name1', 'mail1', '8768858'),
(3, 'name3', 'mail3', '51516265');

-- --------------------------------------------------------

--
-- Table structure for table `uses`
--

CREATE TABLE `uses` (
  `id_no` int(20) NOT NULL,
  `card_no` varchar(20) NOT NULL,
  `source_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `vehicle_no` varchar(10) NOT NULL,
  `source_loc` varchar(22) DEFAULT NULL,
  `destination_loc` varchar(22) DEFAULT NULL,
  `destination_time` varchar(30) DEFAULT NULL,
  `distance` int(12) DEFAULT NULL,
  `fare` int(7) DEFAULT NULL,
  `journey_status` int(2) NOT NULL,
  `passengeruser_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `uses`
--

INSERT INTO `uses` (`id_no`, `card_no`, `source_time`, `vehicle_no`, `source_loc`, `destination_loc`, `destination_time`, `distance`, `fare`, `journey_status`, `passengeruser_id`) VALUES
(1, 'B94ED5D0', '2022-07-31 20:12:06', 'WB20K0568', '22.266609, 88.355148', '22.240851, 88.372057', '2022-08-01 1:41:59', 7240, 21, 0, 'tester1'),
(2, 'D91E13CC', '2022-07-31 19:12:53', 'WB24J1958', '22.266609, 88.355148', '22.236736, 88.272722', '2022-07-31 19:37:6', 60, 180, 0, 'tester2'),
(3, 'D91E13CC', '2022-07-31 19:13:44', 'WB24K5164', '22.266609, 88.355148', '22.630959, 88.433893', '2022-07-31 19:37:6', 10, 30, 0, 'tester2'),
(4, 'B94ED5D0', '2022-07-31 20:12:06', 'WB24L1562', '22.266609, 88.355148', '22.240851, 88.372057', '2022-08-01 1:41:59', 7240, 21, 0, 'tester1'),
(11, 'B94ED5D0', '2022-07-31 20:12:06', 'WB24K5164', '22.240851, 88.372057', '22.240851, 88.372057', '2022-08-01 1:41:59', 7240, 21, 0, 'tester1'),
(12, 'D91E13CC', '2022-07-31 19:15:14', 'WB24K5164', '22.240851, 88.372057', '22.266609, 88.355148', '2022-07-31 19:37:6', 50, 150, 0, 'tester2'),
(14, 'D91E13CC', '2022-07-31 19:15:47', 'WB24K5164', '22.266609, 88.355148', '22.240851, 88.372057', '2022-07-31 19:37:6', 60, 180, 0, 'tester2'),
(16, 'B94ED5D0', '2022-07-31 20:12:06', 'WB24K5164', '22.266609, 88.355148', '22.240851, 88.372057', '2022-08-01 1:41:59', 7240, 21, 0, 'tester1');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `id_no` int(10) NOT NULL,
  `vehicle_no` varchar(10) NOT NULL,
  `board_mac_no` varchar(30) NOT NULL,
  `rto_id` varchar(6) NOT NULL,
  `owner_name` varchar(50) NOT NULL,
  `owner_contact` text NOT NULL,
  `driver_name` varchar(50) NOT NULL,
  `driver_contact` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`id_no`, `vehicle_no`, `board_mac_no`, `rto_id`, `owner_name`, `owner_contact`, `driver_name`, `driver_contact`) VALUES
(0, 'J9051', '22:66:58:92:14:68', 'WB20', 'Supriyo', '9854673129', 'Amitava', '6295487391'),
(0, 'L3045', '25:61:43:98:24:92', 'WB20', 'Biswajit', '6295487124', 'Bodhi', '6598412578');

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id_no` int(11) NOT NULL,
  `card_no` varchar(20) NOT NULL,
  `trans_type` varchar(10) NOT NULL,
  `amount` int(10) NOT NULL,
  `balance` int(15) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(2) NOT NULL,
  `user_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id_no`, `card_no`, `trans_type`, `amount`, `balance`, `time`, `status`, `user_id`) VALUES
(1, 'B94ED5D0', 'Deposited', 100, 100, '2022-07-31 19:30:58', 1, 'tester1'),
(2, 'D91E13CC', 'Deposited', 500, 500, '2022-07-31 19:30:26', 1, 'tester2'),
(3, 'B94ED5D0', 'Deducted', 25, 75, '2022-07-31 19:31:03', 1, 'tester1'),
(4, 'P37K52Y9', 'Deducted', 50, 450, '2022-07-17 18:18:14', 1, 'tester2'),
(5, 'D91E13CC', 'Deposited', 50, 500, '2022-07-31 19:30:20', 1, 'tester2'),
(6, 'D91E13CC', 'Deposited', 40, 540, '2022-07-31 19:30:34', 1, 'tester2'),
(7, 'D91E13CC', 'Deposited', 40, 580, '2022-07-31 19:30:08', 1, 'tester2'),
(8, 'B94ED5D0', 'Deposited', 50, 125, '2022-07-31 19:31:09', 1, 'tester1'),
(9, 'B94ED5D0', 'Deposited', 20, 145, '2022-07-31 19:31:19', 1, 'tester1'),
(10, 'B94ED5D0', 'Deposited', 55, 200, '2022-07-31 19:31:14', 1, 'tester1'),
(11, 'D91E13CC', 'Deposited', 20, 600, '2022-07-31 19:29:55', 1, 'tester2'),
(31, '2BB3014F', 'Opened', 0, 0, '2022-07-31 19:29:36', 1, 'user2'),
(32, '59B5D9D0', 'Opened', 0, 0, '2022-07-31 19:29:17', 1, 'user1'),
(33, 'B94ED5D0', 'Deducted', 21, 145, '2022-07-31 20:00:23', 1, 'tester1'),
(35, 'B94ED5D0', 'Deducted', 21, 124, '2022-07-31 20:09:47', 1, 'tester1'),
(36, 'B94ED5D0', 'Deducted', 21, 103, '2022-07-31 20:11:59', 1, 'tester1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `card_history`
--
ALTER TABLE `card_history`
  ADD KEY `FKcard_histo247431` (`passengeruser_id`,`card_no`,`passengeremail`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`complaint_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `officer`
--
ALTER TABLE `officer`
  ADD PRIMARY KEY (`id_no`),
  ADD UNIQUE KEY `password` (`password`),
  ADD KEY `id_no` (`id_no`);

--
-- Indexes for table `passenger`
--
ALTER TABLE `passenger`
  ADD PRIMARY KEY (`user_id`,`card_no`,`email`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `id_num` (`id_num`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_no` (`id_no`);

--
-- Indexes for table `rto`
--
ALTER TABLE `rto`
  ADD UNIQUE KEY `rto_id` (`rto_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uses`
--
ALTER TABLE `uses`
  ADD PRIMARY KEY (`id_no`),
  ADD KEY `id_no` (`id_no`),
  ADD KEY `FKuses514260` (`passengeruser_id`,`card_no`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicle_no`,`board_mac_no`),
  ADD UNIQUE KEY `vehicle_no` (`vehicle_no`),
  ADD UNIQUE KEY `board_mac_no` (`board_mac_no`),
  ADD KEY `id_no` (`id_no`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `officer`
--
ALTER TABLE `officer`
  MODIFY `id_no` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `uses`
--
ALTER TABLE `uses`
  MODIFY `id_no` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card_history`
--
ALTER TABLE `card_history`
  ADD CONSTRAINT `FKcard_histo247431` FOREIGN KEY (`passengeruser_id`,`card_no`,`passengeremail`) REFERENCES `passenger` (`user_id`, `card_no`, `email`);

--
-- Constraints for table `uses`
--
ALTER TABLE `uses`
  ADD CONSTRAINT `FKuses514260` FOREIGN KEY (`passengeruser_id`,`card_no`) REFERENCES `passenger` (`user_id`, `card_no`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
