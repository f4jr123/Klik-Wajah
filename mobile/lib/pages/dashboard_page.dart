import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FE),
      // 1. Sidebar (Drawer)
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.white),
              child: Center(
                child: Text('Absensi', 
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A2A47))),
              ),
            ),
            _buildDrawerItem(Icons.dashboard_outlined, 'Dashboard', isActive: true),
            _buildDrawerItem(Icons.assignment_ind_outlined, 'Pengajuan Absen'),
            _buildDrawerItem(Icons.history, 'Riwayat Absen'),
          ],
        ),
      ),
      appBar: AppBar(
        backgroundColor: const Color(0xFF7B61FF),
        elevation: 0,
        title: const Text('SMART ATTENDANCE', style: TextStyle(fontSize: 14, color: Colors.white70)),
        actions: [
          const Center(child: Text('Yona', style: TextStyle(color: Colors.white))),
          const SizedBox(width: 10),
          const CircleAvatar(
            backgroundImage: NetworkImage('https://via.placeholder.com/150'),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Background Ungu
            Container(
              width: double.infinity,
              height: 100,
              decoration: const BoxDecoration(
                color: Color(0xFF7B61FF),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
            ),
            
            Transform.translate(
              offset: const Offset(0, -60),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Statistik Bulan Ini', 
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    
                    // 2. Statistik Grid
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 1.5,
                      children: [
                        _buildStatCard('HADIR', '0', const Color(0xFF4FD1C5), Icons.check),
                        _buildStatCard('TELAT', '0', const Color(0xFFF6AD55), Icons.access_time),
                        _buildStatCard('IZIN/SAKIT', '0', const Color(0xFF00B5D8), Icons.medical_services_outlined),
                        _buildStatCard('ALPHA', '0', const Color(0xFFF56565), Icons.close),
                      ],
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // 3. Overview Card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('OVERVIEW', style: TextStyle(fontSize: 10, color: Colors.grey)),
                                  Text('Absensi Hari Ini', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                ],
                              ),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF6A56E5),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                child: const Text('Lakukan Absen', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              _buildTimeBox('JAM MASUK', '--:--', const Color(0xFF4FD1C5)),
                              const SizedBox(width: 8),
                              _buildTimeBox('JAM PULANG', '--:--', const Color(0xFFF687B3)),
                              const SizedBox(width: 8),
                              _buildTimeBox('STATUS', 'BELUM ABSEN', Colors.grey, isStatus: true),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget Helper untuk Item Sidebar
  Widget _buildDrawerItem(IconData icon, String title, {bool isActive = false}) {
    return ListTile(
      leading: Icon(icon, color: isActive ? const Color(0xFF7B61FF) : Colors.grey),
      title: Text(title, style: TextStyle(color: isActive ? const Color(0xFF7B61FF) : Colors.grey)),
      onTap: () {},
    );
  }

  // Widget Helper untuk Card Statistik
  Widget _buildStatCard(String label, String count, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
              Text(count, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const Text('Bulan Ini', style: TextStyle(fontSize: 9, color: Colors.grey)),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            child: Icon(icon, color: Colors.white, size: 18),
          ),
        ],
      ),
    );
  }

  // Widget Helper untuk Kotak Jam
  Widget _buildTimeBox(String label, String value, Color valueColor, {bool isStatus = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A2A47),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Text(label, style: const TextStyle(color: Colors.white70, fontSize: 8)),
            const SizedBox(height: 4),
            Text(value, 
              textAlign: TextAlign.center,
              style: TextStyle(
                color: valueColor, 
                fontSize: isStatus ? 10 : 16, 
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}