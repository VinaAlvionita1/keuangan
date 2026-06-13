CREATE TABLE `jenis_dokumen` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kode` varchar(50) NOT NULL,
	`nama` text NOT NULL,
	CONSTRAINT `jenis_dokumen_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `letters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tanggal` timestamp NOT NULL,
	`nomor_surat` text NOT NULL,
	`jenis` varchar(50) NOT NULL,
	`perihal` text NOT NULL,
	`klien` text NOT NULL,
	`status` varchar(50) NOT NULL,
	`file_link` text,
	`deskripsi_singkat` text,
	`year` int NOT NULL,
	`urutan` int NOT NULL,
	CONSTRAINT `letters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `surat_masuk` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tanggal_terima` timestamp NOT NULL,
	`nomor_surat` text NOT NULL,
	`pengirim` text NOT NULL,
	`perihal` text NOT NULL,
	`status` varchar(50) NOT NULL,
	`file_link` text,
	`deskripsi_singkat` text,
	CONSTRAINT `surat_masuk_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaksi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tanggal` timestamp NOT NULL DEFAULT (now()),
	`keterangan` text NOT NULL,
	`tipe` varchar(10) NOT NULL,
	`nominal` int NOT NULL,
	CONSTRAINT `transaksi_id` PRIMARY KEY(`id`)
);
