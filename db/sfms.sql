-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2026 at 12:54 PM
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
(2, '2025-2026'),
(3, '2026-2027');

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
(1, 'L3 SOD', NULL),
(2, 'L3 SOD', 'A'),
(3, 'L3 SOD', 'B'),
(4, 'L4 SOD', NULL),
(5, 'L4 SOD', 'A'),
(6, 'L4 SOD', 'B'),
(7, 'L5 SOD', NULL),
(8, 'L5 SOD', 'A'),
(9, 'L5 SOD', 'B'),
(10, 'L3 NIT', NULL),
(11, 'L3 NIT', 'A'),
(12, 'L3 NIT', 'B'),
(13, 'L4 NIT', NULL),
(14, 'L4 NIT', 'A'),
(15, 'L4 NIT', 'B'),
(16, 'L5 NIT', NULL),
(17, 'L5 NIT', 'A'),
(18, 'L5 NIT', 'B'),
(19, 'S4 ACC', NULL),
(20, 'S4 ACC', 'A'),
(21, 'S4 ACC', 'B'),
(22, 'S5 ACC', NULL),
(23, 'S5 ACC', 'A'),
(24, 'S5 ACC', 'B'),
(25, 'S6 ACC', NULL),
(26, 'S6 ACC', 'A'),
(27, 'S6 ACC', 'B');

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
(1, 3, 2, 'bursary', 25000.00, 'Government support for Term 2'),
(2, 14, 2, 'scholarship', 30000.00, 'Academic excellence support'),
(3, 10, 2, 'discount', 10000.00, 'Prompt payment discount');

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
(1, 2, 'First Installment', 70000.00, '2026-01-15'),
(2, 2, 'Second Installment', 65000.00, '2026-03-15'),
(3, 8, 'First Installment', 90000.00, '2026-01-15'),
(4, 8, 'Second Installment', 90000.00, '2026-03-15'),
(5, 9, 'First Installment', 50000.00, '2026-01-15'),
(6, 9, 'Second Installment', 50000.00, '2026-03-15'),
(7, 16, 'First Installment', 95000.00, '2026-01-15'),
(8, 16, 'Second Installment', 95000.00, '2026-03-15'),
(9, 18, 'First Installment', 80000.00, '2026-01-15'),
(10, 18, 'Second Installment', 70000.00, '2026-03-15'),
(11, 24, 'First Installment', 100000.00, '2026-01-15'),
(12, 24, 'Second Installment', 95000.00, '2026-03-15'),
(13, 26, 'First Installment', 70000.00, '2026-01-15'),
(14, 26, 'Second Installment', 70000.00, '2026-03-15'),
(15, 29, 'First Installment', 49000.00, '2026-01-15'),
(16, 29, 'Second Installment', 49000.00, '2026-03-15'),
(17, 35, 'First Installment', 66000.00, '2026-01-15'),
(18, 35, 'Second Installment', 66000.00, '2026-03-15'),
(19, 38, 'First Installment', 74000.00, '2026-01-15'),
(20, 38, 'Second Installment', 74000.00, '2026-03-15'),
(21, 44, 'First Installment', 100000.00, '2026-01-15'),
(22, 44, 'Second Installment', 98000.00, '2026-03-15'),
(23, 45, 'First Installment', 54000.00, '2026-01-15'),
(24, 45, 'Second Installment', 54000.00, '2026-03-15'),
(25, 52, 'First Installment', 90000.00, '2026-01-15'),
(26, 52, 'Second Installment', 85000.00, '2026-03-15'),
(27, 53, 'First Installment', 45000.00, '2026-01-15'),
(28, 53, 'Second Installment', 45000.00, '2026-03-15'),
(29, 58, 'First Installment', 70000.00, '2026-01-15'),
(30, 58, 'Second Installment', 68000.00, '2026-03-15'),
(31, 64, 'First Installment', 91000.00, '2026-01-15'),
(32, 64, 'Second Installment', 91000.00, '2026-03-15'),
(33, 65, 'First Installment', 50000.00, '2026-01-15'),
(34, 65, 'Second Installment', 50000.00, '2026-03-15'),
(35, 72, 'First Installment', 94000.00, '2026-01-15'),
(36, 72, 'Second Installment', 94000.00, '2026-03-15');

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
(1, 2, 2, 1, 'continuing', 95000.00),
(2, 2, 2, 2, 'continuing', 135000.00),
(3, 2, 2, 1, 'new', 120000.00),
(4, 2, 2, 2, 'new', 180000.00),
(5, 3, 2, 1, 'continuing', 95000.00),
(6, 3, 2, 2, 'continuing', 135000.00),
(7, 3, 2, 1, 'new', 120000.00),
(8, 3, 2, 2, 'new', 180000.00),
(9, 5, 2, 1, 'continuing', 100000.00),
(10, 5, 2, 2, 'continuing', 145000.00),
(11, 5, 2, 1, 'new', 130000.00),
(12, 5, 2, 2, 'new', 190000.00),
(13, 6, 2, 1, 'continuing', 100000.00),
(14, 6, 2, 2, 'continuing', 145000.00),
(15, 6, 2, 1, 'new', 130000.00),
(16, 6, 2, 2, 'new', 190000.00),
(17, 8, 2, 1, 'continuing', 105000.00),
(18, 8, 2, 2, 'continuing', 150000.00),
(19, 8, 2, 1, 'new', 135000.00),
(20, 8, 2, 2, 'new', 195000.00),
(21, 9, 2, 1, 'continuing', 105000.00),
(22, 9, 2, 2, 'continuing', 150000.00),
(23, 9, 2, 1, 'new', 135000.00),
(24, 9, 2, 2, 'new', 195000.00),
(25, 11, 2, 1, 'continuing', 98000.00),
(26, 11, 2, 2, 'continuing', 140000.00),
(27, 11, 2, 1, 'new', 125000.00),
(28, 11, 2, 2, 'new', 185000.00),
(29, 12, 2, 1, 'continuing', 98000.00),
(30, 12, 2, 2, 'continuing', 140000.00),
(31, 12, 2, 1, 'new', 125000.00),
(32, 12, 2, 2, 'new', 185000.00),
(33, 14, 2, 1, 'continuing', 103000.00),
(34, 14, 2, 2, 'continuing', 148000.00),
(35, 14, 2, 1, 'new', 132000.00),
(36, 14, 2, 2, 'new', 192000.00),
(37, 15, 2, 1, 'continuing', 103000.00),
(38, 15, 2, 2, 'continuing', 148000.00),
(39, 15, 2, 1, 'new', 132000.00),
(40, 15, 2, 2, 'new', 192000.00),
(41, 17, 2, 1, 'continuing', 108000.00),
(42, 17, 2, 2, 'continuing', 155000.00),
(43, 17, 2, 1, 'new', 138000.00),
(44, 17, 2, 2, 'new', 198000.00),
(45, 18, 2, 1, 'continuing', 108000.00),
(46, 18, 2, 2, 'continuing', 155000.00),
(47, 18, 2, 1, 'new', 138000.00),
(48, 18, 2, 2, 'new', 198000.00),
(49, 20, 2, 1, 'continuing', 90000.00),
(50, 20, 2, 2, 'continuing', 130000.00),
(51, 20, 2, 1, 'new', 118000.00),
(52, 20, 2, 2, 'new', 175000.00),
(53, 21, 2, 1, 'continuing', 90000.00),
(54, 21, 2, 2, 'continuing', 130000.00),
(55, 21, 2, 1, 'new', 118000.00),
(56, 21, 2, 2, 'new', 175000.00),
(57, 23, 2, 1, 'continuing', 95000.00),
(58, 23, 2, 2, 'continuing', 138000.00),
(59, 23, 2, 1, 'new', 123000.00),
(60, 23, 2, 2, 'new', 182000.00),
(61, 24, 2, 1, 'continuing', 95000.00),
(62, 24, 2, 2, 'continuing', 138000.00),
(63, 24, 2, 1, 'new', 123000.00),
(64, 24, 2, 2, 'new', 182000.00),
(65, 26, 2, 1, 'continuing', 100000.00),
(66, 26, 2, 2, 'continuing', 145000.00),
(67, 26, 2, 1, 'new', 128000.00),
(68, 26, 2, 2, 'new', 188000.00),
(69, 27, 2, 1, 'continuing', 100000.00),
(70, 27, 2, 2, 'continuing', 145000.00),
(71, 27, 2, 1, 'new', 128000.00),
(72, 27, 2, 2, 'new', 188000.00);

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
(1, 'Jean', 'Habimana', '0788000101', 'jean.habimana@example.com', '2026-03-09 11:51:59'),
(2, 'Marie', 'Mukamana', '0788000102', 'marie.mukamana@example.com', '2026-03-09 11:51:59'),
(3, 'Claude', 'Ndayisaba', '0788000103', 'claude.ndayisaba@example.com', '2026-03-09 11:51:59'),
(4, 'Alice', 'Uwimana', '0788000104', 'alice.uwimana@example.com', '2026-03-09 11:51:59'),
(5, 'David', 'Mugabo', '0788000105', 'david.mugabo@example.com', '2026-03-09 11:51:59');

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
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 3, 7),
(6, 3, 8),
(7, 4, 13),
(8, 4, 14),
(9, 5, 17),
(10, 5, 18);

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
(1, 1, 2, 70000.00, '2026-01-10', 'cash', 'PAY-2026-0001'),
(2, 1, 2, 65000.00, '2026-03-09', 'bank', 'PAY-2026-0002'),
(3, 2, 8, 90000.00, '2026-01-12', 'mobile_money', 'PAY-2026-0003'),
(4, 2, 8, 30000.00, '2026-03-02', 'cash', 'PAY-2026-0004'),
(5, 3, 9, 40000.00, '2026-01-15', 'bank', 'PAY-2026-0005'),
(6, 3, 9, 35000.00, '2026-03-03', 'cash', 'PAY-2026-0006'),
(7, 4, 16, 95000.00, '2026-01-20', 'bank', 'PAY-2026-0007'),
(8, 5, 18, 80000.00, '2026-01-18', 'cash', 'PAY-2026-0008'),
(9, 5, 18, 75000.00, '2026-03-06', 'mobile_money', 'PAY-2026-0009'),
(10, 6, 24, 100000.00, '2026-01-22', 'bank', 'PAY-2026-0010'),
(11, 6, 24, 95000.00, '2026-03-08', 'cash', 'PAY-2026-0011'),
(12, 7, 26, 70000.00, '2026-01-16', 'mobile_money', 'PAY-2026-0012'),
(13, 7, 26, 40000.00, '2026-03-01', 'cash', 'PAY-2026-0013'),
(14, 8, 29, 98000.00, '2026-02-01', 'bank', 'PAY-2026-0014'),
(15, 9, 35, 60000.00, '2026-01-25', 'cash', 'PAY-2026-0015'),
(16, 10, 38, 74000.00, '2026-01-27', 'bank', 'PAY-2026-0016'),
(17, 10, 38, 64000.00, '2026-03-07', 'mobile_money', 'PAY-2026-0017'),
(18, 11, 44, 100000.00, '2026-02-03', 'bank', 'PAY-2026-0018'),
(19, 11, 44, 98000.00, '2026-03-09', 'cash', 'PAY-2026-0019'),
(20, 12, 45, 50000.00, '2026-01-30', 'cash', 'PAY-2026-0020'),
(21, 13, 52, 85000.00, '2026-01-29', 'bank', 'PAY-2026-0021'),
(22, 14, 53, 30000.00, '2026-02-02', 'cash', 'PAY-2026-0022'),
(23, 14, 53, 30000.00, '2026-03-05', 'bank', 'PAY-2026-0023'),
(24, 15, 58, 138000.00, '2026-03-09', 'mobile_money', 'PAY-2026-0024'),
(25, 16, 64, 90000.00, '2026-01-31', 'bank', 'PAY-2026-0025'),
(26, 16, 64, 92000.00, '2026-03-09', 'cash', 'PAY-2026-0026'),
(27, 17, 65, 50000.00, '2026-01-19', 'cash', 'PAY-2026-0027'),
(28, 18, 72, 188000.00, '2026-03-09', 'bank', 'PAY-2026-0028');

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
(1, 2, 'Lost Book Standard Charge', 15000.00, '2026-01-08'),
(2, 2, 'Broken Desk Standard Charge', 25000.00, '2026-01-08'),
(3, 2, 'Laboratory Equipment Standard Charge', 30000.00, '2026-01-08'),
(4, 2, 'Lost ID Card Standard Charge', 5000.00, '2026-01-08'),
(5, 2, 'Broken Chair Standard Charge', 18000.00, '2026-01-08');

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
(1, 1, 15000.00, '2026-02-05', 'cash'),
(2, 3, 5000.00, '2026-02-15', 'mobile_money'),
(3, 5, 12000.00, '2026-03-04', 'bank');

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
(3, 'Laboratory Equipment Damage', 'Damage to lab equipment', 30000.00),
(4, 'Lost School ID Card', 'Replacement of lost student ID card', 5000.00),
(5, 'Damaged Library Book', 'Returned unusable book', 12000.00),
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
(1, 1, 'RCPT-2026-0001', '2026-03-09 11:52:00'),
(2, 2, 'RCPT-2026-0002', '2026-03-09 11:52:00'),
(3, 3, 'RCPT-2026-0003', '2026-03-09 11:52:00'),
(4, 4, 'RCPT-2026-0004', '2026-03-09 11:52:00'),
(5, 5, 'RCPT-2026-0005', '2026-03-09 11:52:00'),
(6, 6, 'RCPT-2026-0006', '2026-03-09 11:52:00'),
(7, 7, 'RCPT-2026-0007', '2026-03-09 11:52:00'),
(8, 8, 'RCPT-2026-0008', '2026-03-09 11:52:00'),
(9, 9, 'RCPT-2026-0009', '2026-03-09 11:52:00'),
(10, 10, 'RCPT-2026-0010', '2026-03-09 11:52:00'),
(11, 11, 'RCPT-2026-0011', '2026-03-09 11:52:00'),
(12, 12, 'RCPT-2026-0012', '2026-03-09 11:52:00'),
(13, 13, 'RCPT-2026-0013', '2026-03-09 11:52:00'),
(14, 14, 'RCPT-2026-0014', '2026-03-09 11:52:00'),
(15, 15, 'RCPT-2026-0015', '2026-03-09 11:52:00'),
(16, 16, 'RCPT-2026-0016', '2026-03-09 11:52:00'),
(17, 17, 'RCPT-2026-0017', '2026-03-09 11:52:00'),
(18, 18, 'RCPT-2026-0018', '2026-03-09 11:52:00'),
(19, 19, 'RCPT-2026-0019', '2026-03-09 11:52:00'),
(20, 20, 'RCPT-2026-0020', '2026-03-09 11:52:00'),
(21, 21, 'RCPT-2026-0021', '2026-03-09 11:52:00'),
(22, 22, 'RCPT-2026-0022', '2026-03-09 11:52:00'),
(23, 23, 'RCPT-2026-0023', '2026-03-09 11:52:00'),
(24, 24, 'RCPT-2026-0024', '2026-03-09 11:52:00'),
(25, 25, 'RCPT-2026-0025', '2026-03-09 11:52:00'),
(26, 26, 'RCPT-2026-0026', '2026-03-09 11:52:00'),
(27, 27, 'RCPT-2026-0027', '2026-03-09 11:52:00'),
(28, 28, 'RCPT-2026-0028', '2026-03-09 11:52:00');

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
(1, 3, 'Government support', 1),
(2, 14, 'Academic sponsorship', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school_setting`
--

CREATE TABLE `school_setting` (
  `setting_id` int(11) NOT NULL,
  `current_year_id` int(11) NOT NULL,
  `current_term_id` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_setting`
--

INSERT INTO `school_setting` (`setting_id`, `current_year_id`, `current_term_id`, `updated_at`) VALUES
(1, 2, 2, '2026-03-09 11:51:59');

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
(1, 'STD001', 'Aline', 'Uwase', 'Female', 2, 'active', 2, 'continuing'),
(2, 'STD002', 'Eric', 'Niyomugabo', 'Male', 3, 'active', 2, 'new'),
(3, 'STD003', 'Claudine', 'Mukamana', 'Female', 5, 'active', 1, 'continuing'),
(4, 'STD004', 'Patrick', 'Mugisha', 'Male', 6, 'active', 2, 'new'),
(5, 'STD005', 'Samuel', 'Habineza', 'Male', 8, 'active', 2, 'continuing'),
(6, 'STD006', 'Olga', 'Aganze', 'Female', 9, 'active', 2, 'new'),
(7, 'STD007', 'Pacifique', 'Nshimiyimana', 'Male', 11, 'active', 2, 'continuing'),
(8, 'STD008', 'Diane', 'Mukandayisenga', 'Female', 12, 'active', 1, 'continuing'),
(9, 'STD009', 'Kevin', 'Iradukunda', 'Male', 14, 'active', 2, 'new'),
(10, 'STD010', 'Grace', 'Umutoni', 'Female', 15, 'active', 2, 'continuing'),
(11, 'STD011', 'Yvette', 'Ndayisaba', 'Female', 17, 'active', 2, 'new'),
(12, 'STD012', 'Moses', 'Hategekimana', 'Male', 18, 'active', 1, 'continuing'),
(13, 'STD013', 'Lionel', 'Nsengiyumva', 'Male', 20, 'active', 2, 'new'),
(14, 'STD014', 'Sandrine', 'Ingabire', 'Female', 21, 'active', 1, 'continuing'),
(15, 'STD015', 'Jean', 'Claude', 'Male', 23, 'active', 2, 'continuing'),
(16, 'STD016', 'Chantal', 'Umuhoza', 'Female', 24, 'active', 2, 'new'),
(17, 'STD017', 'Blaise', 'Nkurunziza', 'Male', 26, 'active', 1, 'continuing'),
(18, 'STD018', 'Gloria', 'Ishimwe', 'Female', 27, 'active', 2, 'new');

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
,`class_display` varchar(71)
,`year_name` varchar(20)
,`term_name` varchar(20)
,`total_fee` decimal(10,2)
,`total_paid` decimal(32,2)
,`total_adjustment` decimal(32,2)
,`outstanding_balance` decimal(34,2)
,`credit_balance` decimal(34,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_payment_history`
-- (See below for the actual view)
--
CREATE TABLE `student_payment_history` (
`student_id` int(11)
,`registration_number` varchar(50)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`class_display` varchar(71)
,`term_name` varchar(20)
,`year_name` varchar(20)
,`amount_paid` decimal(10,2)
,`payment_date` date
,`payment_method` enum('cash','bank','mobile_money')
,`transaction_reference` varchar(100)
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
(1, 1, 1, 15000.00, 'Lost history book', '2026-02-01', 'paid'),
(2, 4, 2, 25000.00, 'Desk broken during lesson', '2026-02-10', 'unpaid'),
(3, 8, 4, 5000.00, 'Lost student ID card', '2026-02-12', 'paid'),
(4, 11, 6, 18000.00, 'Broken classroom chair', '2026-02-20', 'unpaid'),
(5, 14, 5, 12000.00, 'Damaged library book', '2026-03-02', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

CREATE TABLE `term` (
  `term_id` int(11) NOT NULL,
  `term_name` varchar(20) NOT NULL,
  `year_id` int(11) NOT NULL,
  `is_current` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `term`
--

INSERT INTO `term` (`term_id`, `term_name`, `year_id`, `is_current`) VALUES
(1, 'Term 1', 2, 0),
(2, 'Term 2', 2, 1),
(3, 'Term 3', 2, 0),
(4, 'Term 1', 3, 0),
(5, 'Term 2', 3, 0),
(6, 'Term 3', 3, 0);

-- --------------------------------------------------------

--
-- Structure for view `student_fee_status`
--
DROP TABLE IF EXISTS `student_fee_status`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_fee_status`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`registration_number` AS `registration_number`, `s`.`first_name` AS `first_name`, `s`.`last_name` AS `last_name`, concat(`c`.`class_name`,if(`c`.`section` is not null,concat(' ',`c`.`section`),'')) AS `class_display`, `ay`.`year_name` AS `year_name`, `t`.`term_name` AS `term_name`, `fs`.`total_fee` AS `total_fee`, coalesce(sum(`p`.`amount_paid`),0) AS `total_paid`, coalesce(`fa`.`total_adjustment`,0) AS `total_adjustment`, greatest(`fs`.`total_fee` - coalesce(`fa`.`total_adjustment`,0) - coalesce(sum(`p`.`amount_paid`),0),0) AS `outstanding_balance`, greatest(coalesce(sum(`p`.`amount_paid`),0) - (`fs`.`total_fee` - coalesce(`fa`.`total_adjustment`,0)),0) AS `credit_balance` FROM (((((((`student` `s` join `class` `c` on(`s`.`class_id` = `c`.`class_id`)) join `school_setting` `ss` on(`ss`.`setting_id` = 1)) join `term` `t` on(`t`.`term_id` = `ss`.`current_term_id`)) join `academic_year` `ay` on(`ay`.`year_id` = `ss`.`current_year_id`)) join `fee_structure` `fs` on(`fs`.`class_id` = `s`.`class_id` and `fs`.`term_id` = `t`.`term_id` and `fs`.`category_id` = `s`.`category_id` and `fs`.`admission_type` = `s`.`admission_type`)) left join `payment` `p` on(`p`.`student_id` = `s`.`student_id` and `p`.`fee_id` = `fs`.`fee_id`)) left join (select `fee_adjustment`.`student_id` AS `student_id`,`fee_adjustment`.`term_id` AS `term_id`,sum(`fee_adjustment`.`amount`) AS `total_adjustment` from `fee_adjustment` group by `fee_adjustment`.`student_id`,`fee_adjustment`.`term_id`) `fa` on(`fa`.`student_id` = `s`.`student_id` and `fa`.`term_id` = `t`.`term_id`)) GROUP BY `s`.`student_id`, `s`.`registration_number`, `s`.`first_name`, `s`.`last_name`, `c`.`class_name`, `c`.`section`, `ay`.`year_name`, `t`.`term_name`, `fs`.`total_fee`, `fa`.`total_adjustment` ;

-- --------------------------------------------------------

--
-- Structure for view `student_payment_history`
--
DROP TABLE IF EXISTS `student_payment_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_payment_history`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`registration_number` AS `registration_number`, `s`.`first_name` AS `first_name`, `s`.`last_name` AS `last_name`, concat(`c`.`class_name`,if(`c`.`section` is not null,concat(' ',`c`.`section`),'')) AS `class_display`, `t`.`term_name` AS `term_name`, `ay`.`year_name` AS `year_name`, `p`.`amount_paid` AS `amount_paid`, `p`.`payment_date` AS `payment_date`, `p`.`payment_method` AS `payment_method`, `p`.`transaction_reference` AS `transaction_reference` FROM (((((`payment` `p` join `student` `s` on(`p`.`student_id` = `s`.`student_id`)) join `fee_structure` `fs` on(`p`.`fee_id` = `fs`.`fee_id`)) join `class` `c` on(`s`.`class_id` = `c`.`class_id`)) join `term` `t` on(`fs`.`term_id` = `t`.`term_id`)) join `academic_year` `ay` on(`t`.`year_id` = `ay`.`year_id`)) ;

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
-- Indexes for table `school_setting`
--
ALTER TABLE `school_setting`
  ADD PRIMARY KEY (`setting_id`),
  ADD KEY `fk_school_setting_year` (`current_year_id`),
  ADD KEY `fk_school_setting_term` (`current_term_id`);

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
  MODIFY `year_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `fee_adjustment`
--
ALTER TABLE `fee_adjustment`
  MODIFY `adjustment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fee_installment`
--
ALTER TABLE `fee_installment`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `fee_structure`
--
ALTER TABLE `fee_structure`
  MODIFY `fee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `parent`
--
ALTER TABLE `parent`
  MODIFY `parent_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `parent_account`
--
ALTER TABLE `parent_account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parent_student`
--
ALTER TABLE `parent_student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `penalty`
--
ALTER TABLE `penalty`
  MODIFY `penalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `receipt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `scholarship_or_free_student`
--
ALTER TABLE `scholarship_or_free_student`
  MODIFY `free_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `school_setting`
--
ALTER TABLE `school_setting`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `student_penalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `term`
--
ALTER TABLE `term`
  MODIFY `term_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- Constraints for table `school_setting`
--
ALTER TABLE `school_setting`
  ADD CONSTRAINT `fk_school_setting_term` FOREIGN KEY (`current_term_id`) REFERENCES `term` (`term_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_school_setting_year` FOREIGN KEY (`current_year_id`) REFERENCES `academic_year` (`year_id`) ON UPDATE CASCADE;

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
