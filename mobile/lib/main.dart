import 'package:flutter/material.dart';
//import 'pages/register_page.dart'; // Pastikan path file benar
//import 'pages/login_page.dart'; // Pastikan path file benar
//import 'pages/dashboard_Page.dart'; // Pastikan path file benar
//import 'pages/pengajuan_page.dart'; // Pastikan path file benar
import 'pages/riwayat_page.dart'; // Pastikan path file benar

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Aplikasi login',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF7B61FF),
      ),
      // Langsung arahkan 'home' ke RegisterPage
      // home: const RegisterPage(),
      // home: const LoginPage(), // Hapus atau komentari baris ini jika ingin langsung ke RegisterPage
      //home: const DashboardPage(), // Hapus atau komentari baris ini jika ingin langsung ke RegisterPage
      //home: const PengajuanPage(), // Hapus atau komentari baris ini jika ingin langsung ke RegisterPage
      home: const RiwayatPage(), // Hapus atau komentari baris ini jika ingin langsung ke RegisterPage
    );
  }
}
