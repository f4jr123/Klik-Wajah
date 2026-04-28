import 'package:flutter/material.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Menggunakan Stack untuk membuat background dua warna
      body: Stack(
        children: [
          // 1. Background Layer
          Column(
            children: [
              Expanded(
                flex: 1,
                child: Container(color: const Color(0xFF7B61FF)), // Ungu
              ),
              Expanded(
                flex: 1,
                child: Container(color: const Color(0xFF1A2A47)), // Biru Gelap
              ),
            ],
          ),
          
          // 2. Content Layer
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  children: [
                    // Header Text
                    const Text(
                      'Register',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Use these awesome forms to login or create new account in your project for free.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(height: 32),

                    // Register Card
                    Container(
                      padding: const EdgeInsets.all(24.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F9FA),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildTextField(Icons.badge_outlined, 'ID Karyawan'),
                          const SizedBox(height: 16),
                          _buildTextField(Icons.person_outline, 'Nama'),
                          const SizedBox(height: 16),
                          _buildTextField(Icons.email_outlined, 'Email'),
                          const SizedBox(height: 16),
                          _buildTextField(Icons.lock_outline, 'Password', isPassword: true),
                          
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              const Text('Sudah punya akun? ', style: TextStyle(color: Colors.grey)),
                              GestureDetector(
                                onTap: () {
                                  // Navigasi ke Login
                                },
                                child: const Text(
                                  'Login...',
                                  style: TextStyle(
                                    color: Color(0xFF7B61FF),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          
                          // Tombol Regist
                          Align(
                            alignment: Alignment.centerRight,
                            child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF6A56E5),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: const Text('Regist', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper function untuk membuat TextField dengan Ikon
  Widget _buildTextField(IconData icon, String hint, {bool isPassword = false}) {
    return TextField(
      obscureText: isPassword,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.grey),
        prefixIcon: Icon(icon, color: Colors.grey),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 12),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFFDEE2E6)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF7B61FF), width: 2),
        ),
      ),
    );
  }
}