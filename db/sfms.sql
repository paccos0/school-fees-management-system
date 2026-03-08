-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2026 at 06:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sfms`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_year`
--

CREATE TABLE `academic_year` (
  `year_id` int(11) NOT NULL,
  `year_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_year`
--

INSERT INTO `academic_year` (`year_id`, `year_name`) VALUES
(1, '2024-2025'),
(2, '2025-2026');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('bursar','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`, `role`, `created_at`, `first_name`, `last_name`, `gender`, `dob`, `address`) VALUES
(1, 'admin', '$2b$10$DjsPTagB37gKpKLEz72ye.TqpRpKSrxHqiW8xPPZEJ7AfbTWSLSle', 'admin', '2026-03-07 05:21:16', 'NYIZIGIRE', 'Marguaritte', 'female', '1988-11-28', 'Muhanga'),
(2, 'bursar', '$2b$10$ypkHTW/v3/1sfqtgRCNVR.saJDyCR2PRyyDBD9QU39aQ9cXK3L8KG', 'bursar', '2026-03-07 05:22:06', 'MUNYANEZA', 'Basile', 'male', '1987-11-28', 'Muhanga');

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `section` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `class_name`, `section`) VALUES
(1, 'Senior 1', 'A'),
(2, 'Senior 2', 'A'),
(3, 'Senior 3', 'A'),
(4, 'Senior 4', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `fee_adjustment`
--

CREATE TABLE `fee_adjustment` (
  `adjustment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `adjustment_type` enum('discount','scholarship','bursary') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_adjustment`
--

INSERT INTO `fee_adjustment` (`adjustment_id`, `student_id`, `term_id`, `adjustment_type`, `amount`, `reason`) VALUES
(1, 1, 1, 'discount', 5000.00, 'Merit-based discount'),
(2, 4, 1, 'scholarship', 15000.00, 'Academic support'),
(3, 5, 1, 'bursary', 30000.00, 'Community sponsorship');

-- --------------------------------------------------------

--
-- Table structure for table `fee_installment`
--

CREATE TABLE `fee_installment` (
  `installment_id` int(11) NOT NULL,
  `fee_id` int(11) NOT NULL,
  `installment_name` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_installment`
--

INSERT INTO `fee_installment` (`installment_id`, `fee_id`, `installment_name`, `amount`, `due_date`) VALUES
(1, 9, 'First Installment', 50000.00, '2026-01-15'),
(2, 9, 'Second Installment', 42000.00, '2026-03-15'),
(3, 10, 'First Installment', 70000.00, '2026-01-15'),
(4, 10, 'Second Installment', 65000.00, '2026-03-15'),
(5, 13, 'First Installment', 50000.00, '2026-01-15'),
(6, 13, 'Second Installment', 48000.00, '2026-03-15');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure`
--

CREATE TABLE `fee_structure` (
  `fee_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `admission_type` enum('new','continuing') NOT NULL,
  `total_fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_structure`
--

INSERT INTO `fee_structure` (`fee_id`, `class_id`, `term_id`, `category_id`, `admission_type`, `total_fee`) VALUES
(9, 1, 1, 1, 'continuing', 92000.00),
(10, 1, 1, 2, 'continuing', 135000.00),
(11, 1, 1, 1, 'new', 120000.00),
(12, 1, 1, 2, 'new', 200000.00),
(13, 2, 1, 1, 'continuing', 98000.00),
(14, 2, 1, 2, 'continuing', 145000.00),
(15, 2, 1, 2, 'new', 210000.00),
(16, 3, 1, 2, 'new', 230000.00);

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `parent_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`parent_id`, `first_name`, `last_name`, `phone`, `email`, `created_at`) VALUES
(1, 'Jean', 'Habimana', '0788000001', 'jean@example.com', '2026-03-08 05:20:42'),
(2, 'Marie', 'Mukamana', '0788000002', 'marie@example.com', '2026-03-08 05:20:42'),
(3, 'Claude', 'Ndayisaba', '0788000003', 'claude@example.com', '2026-03-08 05:20:42');

-- --------------------------------------------------------

--
-- Table structure for table `parent_account`
--

CREATE TABLE `parent_account` (
  `account_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parent_student`
--

CREATE TABLE `parent_student` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parent_student`
--

INSERT INTO `parent_student` (`id`, `parent_id`, `student_id`) VALUES
(1, 1, 1),
(4, 1, 4),
(2, 2, 2),
(5, 2, 5),
(3, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `fee_id` int(11) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','bank','mobile_money') NOT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `student_id`, `fee_id`, `amount_paid`, `payment_date`, `payment_method`, `transaction_reference`) VALUES
(1, 1, 9, 50000.00, '2026-01-10', 'cash', 'TXN1001'),
(2, 2, 10, 92000.00, '2026-01-11', 'mobile_money', 'TXN1002'),
(3, 3, 15, 60000.00, '2026-01-12', 'bank', 'TXN1003'),
(4, 4, 13, 30000.00, '2026-01-13', 'cash', 'TXN1004'),
(5, 1, 9, 20000.00, '2026-02-05', 'mobile_money', 'TXN1005'),
(6, 5, 16, 50000.00, '2026-02-10', 'bank', 'TXN1006');

-- --------------------------------------------------------

--
-- Table structure for table `penalty`
--

CREATE TABLE `penalty` (
  `penalty_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `penalty_name` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penalty`
--

INSERT INTO `penalty` (`penalty_id`, `term_id`, `penalty_name`, `amount`, `start_date`) VALUES
(1, 1, 'Lost Book Standard Charge', 15000.00, '2026-01-08'),
(2, 1, 'Broken Desk Standard Charge', 25000.00, '2026-01-08'),
(3, 1, 'Lab Equipment Standard Charge', 30000.00, '2026-01-08');

-- --------------------------------------------------------

--
-- Table structure for table `penalty_payment`
--

CREATE TABLE `penalty_payment` (
  `penalty_payment_id` int(11) NOT NULL,
  `student_penalty_id` int(11) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penalty_payment`
--

INSERT INTO `penalty_payment` (`penalty_payment_id`, `student_penalty_id`, `amount_paid`, `payment_date`, `payment_method`) VALUES
(1, 3, 30000.00, '2026-02-25', 'cash'),
(2, 6, 5000.00, '2026-03-03', 'mobile_money'),
(3, 8, 12000.00, '2026-03-07', 'bank');

-- --------------------------------------------------------

--
-- Table structure for table `penalty_type`
--

CREATE TABLE `penalty_type` (
  `penalty_type_id` int(11) NOT NULL,
  `penalty_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `default_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penalty_type`
--

INSERT INTO `penalty_type` (`penalty_type_id`, `penalty_name`, `description`, `default_amount`) VALUES
(1, 'Lost Book', 'Lost library or classroom book', 15000.00),
(2, 'Broken Desk', 'Damage to classroom desk', 25000.00),
(3, 'Laboratory Equipment Damage', 'Damage to laboratory equipment', 30000.00),
(4, 'Lost School ID Card', 'Replacement of lost student ID card', 5000.00),
(5, 'Damaged Library Book', 'Book returned damaged and unusable', 12000.00),
(6, 'Broken Chair', 'Damage to classroom chair', 18000.00);

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `receipt_id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `issued_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipt`
--

INSERT INTO `receipt` (`receipt_id`, `payment_id`, `receipt_number`, `issued_date`) VALUES
(1, 1, 'RCPT-2026-0001', '2026-03-08 05:20:42'),
(2, 2, 'RCPT-2026-0002', '2026-03-08 05:20:42'),
(3, 3, 'RCPT-2026-0003', '2026-03-08 05:20:42'),
(4, 4, 'RCPT-2026-0004', '2026-03-08 05:20:42'),
(5, 5, 'RCPT-2026-0005', '2026-03-08 05:20:42'),
(6, 6, 'RCPT-2026-0006', '2026-03-08 05:20:42');

-- --------------------------------------------------------

--
-- Table structure for table `scholarship_or_free_student`
--

CREATE TABLE `scholarship_or_free_student` (
  `free_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship_or_free_student`
--

INSERT INTO `scholarship_or_free_student` (`free_id`, `student_id`, `reason`, `approved_by`) VALUES
(1, 5, 'Partial scholarship support', 1);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `registration_number` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `class_id` int(11) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `category_id` int(11) NOT NULL,
  `admission_type` enum('new','continuing') DEFAULT 'continuing'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `registration_number`, `first_name`, `last_name`, `gender`, `class_id`, `status`, `category_id`, `admission_type`) VALUES
(1, 'STD001', 'Fils', 'Shema', 'Male', 1, 'active', 1, 'continuing'),
(2, 'STD002', 'Aline', 'Uwimana', 'Female', 1, 'active', 2, 'continuing'),
(3, 'STD003', 'Patrick', 'Mugisha', 'Male', 2, 'active', 2, 'new'),
(4, 'STD004', 'Diane', 'Mukandayisenga', 'Female', 2, 'active', 1, 'continuing'),
(5, 'STD005', 'Samuel', 'Habineza', 'Male', 3, 'inactive', 2, 'new');

-- --------------------------------------------------------

--
-- Table structure for table `student_account`
--

CREATE TABLE `student_account` (
  `account_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_category`
--

CREATE TABLE `student_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_category`
--

INSERT INTO `student_category` (`category_id`, `category_name`) VALUES
(1, 'Government'),
(2, 'Private');

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_fee_status`
-- (See below for the actual view)
--
CREATE TABLE `student_fee_status` (
`student_id` int(11)
,`registration_number` varchar(50)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`class_name` varchar(50)
,`term_name` varchar(20)
,`year_name` varchar(20)
,`total_fee` decimal(10,2)
,`total_paid` decimal(32,2)
,`balance` decimal(33,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_payment_history`
-- (See below for the actual view)
--
CREATE TABLE `student_payment_history` (
`student_id` int(11)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`term_name` varchar(20)
,`year_name` varchar(20)
,`amount_paid` decimal(10,2)
,`payment_date` date
,`payment_method` enum('cash','bank','mobile_money')
);

-- --------------------------------------------------------

--
-- Table structure for table `student_penalty`
--

CREATE TABLE `student_penalty` (
  `student_penalty_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `penalty_type_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `issued_date` date NOT NULL,
  `status` enum('unpaid','paid') DEFAULT 'unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_penalty`
--

INSERT INTO `student_penalty` (`student_penalty_id`, `student_id`, `penalty_type_id`, `amount`, `description`, `issued_date`, `status`) VALUES
(1, 1, 1, 15000.00, 'Lost library book', '2026-02-10', 'unpaid'),
(2, 3, 2, 25000.00, 'Broken desk during class', '2026-02-15', 'unpaid'),
(3, 4, 3, 30000.00, 'Lab equipment damage', '2026-02-20', 'paid'),
(4, 1, 1, 15000.00, 'Student lost a mathematics textbook from the library.', '2026-03-01', 'unpaid'),
(5, 2, 2, 25000.00, 'Desk broken during class activity.', '2026-03-02', 'unpaid'),
(6, 3, 4, 5000.00, 'Student reported lost school ID card.', '2026-03-03', 'paid'),
(7, 4, 3, 30000.00, 'Laboratory equipment damaged during chemistry experiment.', '2026-03-04', 'unpaid'),
(8, 5, 5, 12000.00, 'Library book returned damaged and unusable.', '2026-03-05', 'paid'),
(9, 2, 6, 18000.00, 'Chair broken in classroom.', '2026-03-06', 'unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

CREATE TABLE `term` (
  `term_id` int(11) NOT NULL,
  `term_name` varchar(20) NOT NULL,
  `year_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `term`
--

INSERT INTO `term` (`term_id`, `term_name`, `year_id`) VALUES
(1, 'Term 1', 2),
(2, 'Term 2', 2),
(3, 'Term 3', 2);

-- --------------------------------------------------------

--
-- Structure for view `student_fee_status`
--
DROP TABLE IF EXISTS `student_fee_status`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_fee_status`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`registration_number` AS `registration_number`, `s`.`first_name` AS `first_name`, `s`.`last_name` AS `last_name`, `c`.`class_name` AS `class_name`, `t`.`term_name` AS `term_name`, `ay`.`year_name` AS `year_name`, `fs`.`total_fee` AS `total_fee`, ifnull(sum(`p`.`amount_paid`),0) AS `total_paid`, `fs`.`total_fee`- ifnull(sum(`p`.`amount_paid`),0) AS `balance` FROM (((((`student` `s` join `class` `c` on(`s`.`class_id` = `c`.`class_id`)) join `fee_structure` `fs` on(`fs`.`class_id` = `c`.`class_id`)) join `term` `t` on(`fs`.`term_id` = `t`.`term_id`)) join `academic_year` `ay` on(`t`.`year_id` = `ay`.`year_id`)) left join `payment` `p` on(`p`.`student_id` = `s`.`student_id` and `p`.`fee_id` = `fs`.`fee_id`)) GROUP BY `s`.`student_id`, `fs`.`fee_id` ;

-- --------------------------------------------------------

--
-- Structure for view `student_payment_history`
--
DROP TABLE IF EXISTS `student_payment_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_payment_history`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`first_name` AS `first_name`, `s`.`last_name` AS `last_name`, `t`.`term_name` AS `term_name`, `ay`.`year_name` AS `year_name`, `p`.`amount_paid` AS `amount_paid`, `p`.`payment_date` AS `payment_date`, `p`.`payment_method` AS `payment_method` FROM ((((`payment` `p` join `student` `s` on(`p`.`student_id` = `s`.`student_id`)) join `fee_structure` `fs` on(`p`.`fee_id` = `fs`.`fee_id`)) join `term` `t` on(`fs`.`term_id` = `t`.`term_id`)) join `academic_year` `ay` on(`t`.`year_id` = `ay`.`year_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_year`
--
ALTER TABLE `academic_year`
  ADD PRIMARY KEY (`year_id`),
  ADD UNIQUE KEY `year_name` (`year_name`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_audit_admin` (`admin_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `fee_adjustment`
--
ALTER TABLE `fee_adjustment`
  ADD PRIMARY KEY (`adjustment_id`),
  ADD KEY `fk_adjust_student` (`student_id`),
  ADD KEY `fk_adjust_term` (`term_id`);

--
-- Indexes for table `fee_installment`
--
ALTER TABLE `fee_installment`
  ADD PRIMARY KEY (`installment_id`),
  ADD KEY `fk_installment_fee` (`fee_id`);

--
-- Indexes for table `fee_structure`
--
ALTER TABLE `fee_structure`
  ADD PRIMARY KEY (`fee_id`),
  ADD UNIQUE KEY `class_id` (`class_id`,`term_id`,`category_id`,`admission_type`),
  ADD KEY `fk_fee_term` (`term_id`),
  ADD KEY `fk_fee_category` (`category_id`);

--
-- Indexes for table `parent`
--
ALTER TABLE `parent`
  ADD PRIMARY KEY (`parent_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `parent_account`
--
ALTER TABLE `parent_account`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `parent_id` (`parent_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `parent_student`
--
ALTER TABLE `parent_student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `parent_id` (`parent_id`,`student_id`),
  ADD KEY `fk_parent_student_student` (`student_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `transaction_reference` (`transaction_reference`),
  ADD KEY `fk_payment_fee` (`fee_id`),
  ADD KEY `idx_payment_student` (`student_id`);

--
-- Indexes for table `penalty`
--
ALTER TABLE `penalty`
  ADD PRIMARY KEY (`penalty_id`),
  ADD KEY `fk_penalty_term` (`term_id`);

--
-- Indexes for table `penalty_payment`
--
ALTER TABLE `penalty_payment`
  ADD PRIMARY KEY (`penalty_payment_id`),
  ADD KEY `fk_penalty_payment` (`student_penalty_id`);

--
-- Indexes for table `penalty_type`
--
ALTER TABLE `penalty_type`
  ADD PRIMARY KEY (`penalty_type_id`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`receipt_id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `fk_receipt_payment` (`payment_id`);

--
-- Indexes for table `scholarship_or_free_student`
--
ALTER TABLE `scholarship_or_free_student`
  ADD PRIMARY KEY (`free_id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `fk_free_admin` (`approved_by`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD KEY `fk_student_class` (`class_id`),
  ADD KEY `fk_student_category` (`category_id`);

--
-- Indexes for table `student_account`
--
ALTER TABLE `student_account`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `student_category`
--
ALTER TABLE `student_category`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `student_penalty`
--
ALTER TABLE `student_penalty`
  ADD PRIMARY KEY (`student_penalty_id`),
  ADD KEY `fk_penalty_student` (`student_id`),
  ADD KEY `fk_penalty_type` (`penalty_type_id`);

--
-- Indexes for table `term`
--
ALTER TABLE `term`
  ADD PRIMARY KEY (`term_id`),
  ADD KEY `idx_term_year` (`year_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_year`
--
ALTER TABLE `academic_year`
  MODIFY `year_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `fee_adjustment`
--
ALTER TABLE `fee_adjustment`
  MODIFY `adjustment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fee_installment`
--
ALTER TABLE `fee_installment`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `fee_structure`
--
ALTER TABLE `fee_structure`
  MODIFY `fee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `parent`
--
ALTER TABLE `parent`
  MODIFY `parent_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `parent_account`
--
ALTER TABLE `parent_account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parent_student`
--
ALTER TABLE `parent_student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `penalty`
--
ALTER TABLE `penalty`
  MODIFY `penalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `penalty_payment`
--
ALTER TABLE `penalty_payment`
  MODIFY `penalty_payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `penalty_type`
--
ALTER TABLE `penalty_type`
  MODIFY `penalty_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `receipt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `scholarship_or_free_student`
--
ALTER TABLE `scholarship_or_free_student`
  MODIFY `free_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student_account`
--
ALTER TABLE `student_account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_category`
--
ALTER TABLE `student_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_penalty`
--
ALTER TABLE `student_penalty`
  MODIFY `student_penalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `term`
--
ALTER TABLE `term`
  MODIFY `term_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `fk_audit_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `fee_adjustment`
--
ALTER TABLE `fee_adjustment`
  ADD CONSTRAINT `fk_adjust_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `fk_adjust_term` FOREIGN KEY (`term_id`) REFERENCES `term` (`term_id`);

--
-- Constraints for table `fee_installment`
--
ALTER TABLE `fee_installment`
  ADD CONSTRAINT `fk_installment_fee` FOREIGN KEY (`fee_id`) REFERENCES `fee_structure` (`fee_id`) ON DELETE CASCADE;

--
-- Constraints for table `fee_structure`
--
ALTER TABLE `fee_structure`
  ADD CONSTRAINT `fk_fee_category` FOREIGN KEY (`category_id`) REFERENCES `student_category` (`category_id`),
  ADD CONSTRAINT `fk_fee_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  ADD CONSTRAINT `fk_fee_term` FOREIGN KEY (`term_id`) REFERENCES `term` (`term_id`);

--
-- Constraints for table `parent_account`
--
ALTER TABLE `parent_account`
  ADD CONSTRAINT `fk_parent_account` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`) ON DELETE CASCADE;

--
-- Constraints for table `parent_student`
--
ALTER TABLE `parent_student`
  ADD CONSTRAINT `fk_parent_student_parent` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_parent_student_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_fee` FOREIGN KEY (`fee_id`) REFERENCES `fee_structure` (`fee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `penalty`
--
ALTER TABLE `penalty`
  ADD CONSTRAINT `fk_penalty_term` FOREIGN KEY (`term_id`) REFERENCES `term` (`term_id`);

--
-- Constraints for table `penalty_payment`
--
ALTER TABLE `penalty_payment`
  ADD CONSTRAINT `fk_penalty_payment` FOREIGN KEY (`student_penalty_id`) REFERENCES `student_penalty` (`student_penalty_id`) ON DELETE CASCADE;

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `fk_receipt_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE;

--
-- Constraints for table `scholarship_or_free_student`
--
ALTER TABLE `scholarship_or_free_student`
  ADD CONSTRAINT `fk_free_admin` FOREIGN KEY (`approved_by`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_free_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `fk_student_category` FOREIGN KEY (`category_id`) REFERENCES `student_category` (`category_id`),
  ADD CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON UPDATE CASCADE;

--
-- Constraints for table `student_account`
--
ALTER TABLE `student_account`
  ADD CONSTRAINT `fk_student_account` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_penalty`
--
ALTER TABLE `student_penalty`
  ADD CONSTRAINT `fk_penalty_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_penalty_type` FOREIGN KEY (`penalty_type_id`) REFERENCES `penalty_type` (`penalty_type_id`);

--
-- Constraints for table `term`
--
ALTER TABLE `term`
  ADD CONSTRAINT `fk_term_year` FOREIGN KEY (`year_id`) REFERENCES `academic_year` (`year_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
