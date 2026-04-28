import 'package:flutter/material.dart';

class PengajuanPage extends StatelessWidget {
  const PengajuanPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FE),
      // Sidebar (Drawer)
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
            _buildDrawerItem(Icons.dashboard_outlined, 'Dashboard'),
            _buildDrawerItem(Icons.assignment_ind_outlined, 'Pengajuan Absen', isActive: true),
            _buildDrawerItem(Icons.history, 'Riwayat Absen'),
          ],
        ),
      ),
      appBar: AppBar(
        backgroundColor: const Color(0xFF7B61FF),
        elevation: 0,
        title: const Text('SMART ATTENDANCE', style: TextStyle(fontSize: 12, color: Colors.white70)),
        actions: const [
          Center(child: Text('Yona', style: TextStyle(color: Colors.white))),
          SizedBox(width: 10),
          CircleAvatar(backgroundImage: NetworkImage('https://via.placeholder.com/150')),
          SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Ungu
            Container(
              width: double.infinity,
              height: 120,
              decoration: const BoxDecoration(
                color: Color(0xFF7B61FF),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
            ),
            
            // Kartu Data (Dark Card)
            Transform.translate(
              offset: const Offset(0, -80),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A2A47),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 15)],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Riwayat Pengajuan Saya', 
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          ElevatedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.add, size: 16),
                            label: const Text('Ajukan'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6A56E5),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      
                      // Simulasi Header Tabel
                      const Row(
                        children: [
                          Expanded(flex: 1, child: Text('NO', style: TextStyle(color: Colors.grey, fontSize: 10))),
                          Expanded(flex: 3, child: Text('TGL MULAI', style: TextStyle(color: Colors.grey, fontSize: 10))),
                          Expanded(flex: 2, child: Text('TIPE', style: TextStyle(color: Colors.grey, fontSize: 10))),
                          Expanded(flex: 2, child: Text('STATUS', style: TextStyle(color: Colors.grey, fontSize: 10))),
                        ],
                      ),
                      const Divider(color: Colors.white24),
                      
                      // Data Baris 1
                      _buildDataRow('1', '20-Nov-2025', 'izin', 'Pending', const Color(0xFFF6AD55)),
                      // Data Baris 2
                      _buildDataRow('2', '15-Nov-2025', 'izin', 'Disetujui', const Color(0xFF4FD1C5)),
                      
                      const SizedBox(height: 20),
                      // Footer Pagination
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('1 s/d 2 dari 2 data', style: TextStyle(color: Colors.grey, fontSize: 10)),
                          Row(
                            children: [
                              _buildPageBtn(Icons.chevron_left),
                              _buildPageBtn(null, text: '1', isActive: true),
                              _buildPageBtn(Icons.chevron_right),
                            ],
                          )
                        ],
                      )
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, {bool isActive = false}) {
    return ListTile(
      leading: Icon(icon, color: isActive ? const Color(0xFF7B61FF) : Colors.grey),
      title: Text(title, style: TextStyle(color: isActive ? const Color(0xFF7B61FF) : Colors.grey)),
    );
  }

  Widget _buildDataRow(String no, String tgl, String tipe, String status, Color statusColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        children: [
          Expanded(flex: 1, child: Text(no, style: const TextStyle(color: Colors.white, fontSize: 12))),
          Expanded(flex: 3, child: Text(tgl, style: const TextStyle(color: Colors.white, fontSize: 12))),
          Expanded(flex: 2, child: Text(tipe, style: const TextStyle(color: Colors.white, fontSize: 12))),
          Expanded(flex: 2, child: Row(
            children: [
              Container(width: 6, height: 6, decoration: BoxDecoration(color: statusColor, shape: BoxShape.circle)),
              const SizedBox(width: 4),
              Text(status, style: TextStyle(color: statusColor, fontSize: 10)),
            ],
          )),
        ],
      ),
    );
  }

  Widget _buildPageBtn(IconData? icon, {String? text, bool isActive = false}) {
    return Container(
      margin: const EdgeInsets.only(left: 4),
      width: 25, height: 25,
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFF7B61FF) : const Color(0xFF2D3748),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: icon != null 
          ? Icon(icon, color: Colors.white, size: 14)
          : Text(text!, style: const TextStyle(color: Colors.white, fontSize: 10)),
      ),
    );
  }
}