import 'package:flutter/material.dart';

class RiwayatPage extends StatelessWidget {
  const RiwayatPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FE),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.white),
              child: Center(
                child: Text(
                  'Absensi',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1A2A47),
                  ),
                ),
              ),
            ),
            _buildDrawerItem(Icons.dashboard_outlined, 'Dashboard'),
            _buildDrawerItem(Icons.assignment_ind_outlined, 'Pengajuan Absen'),
            _buildDrawerItem(Icons.history, 'Riwayat Absen', isActive: true),
          ],
        ),
      ),
      appBar: AppBar(
        backgroundColor: const Color(0xFF7B61FF),
        elevation: 0,
        title: const Text(
          'SMART ATTENDANCE',
          style: TextStyle(
            fontSize: 12,
            color: Colors.white70,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: const [
          Center(
            child: Text('Yona', style: TextStyle(color: Colors.white)),
          ),
          SizedBox(width: 10),
          CircleAvatar(
            radius: 15,
            backgroundImage: NetworkImage('https://via.placeholder.com/150'),
          ),
          SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
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

            Transform.translate(
              offset: const Offset(0, -80),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A2A47),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Riwayat Absensi Saya',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),

                      Row(
                        children: [
                          _buildFilterDropdown(
                            'Pilih Bulan',
                            '-- Semua Bulan --',
                          ),
                          const SizedBox(width: 12),
                          _buildFilterDropdown(
                            'Pilih Tahun',
                            '-- Semua Tahun --',
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6A56E5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Filter Data',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),

                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 20),
                        child: Divider(color: Colors.white24),
                      ),

                      // BAGIAN BARU: Show Entries & Search Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Show Entries
                          Row(
                            children: [
                              const Text(
                                "Show ",
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2D3748),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text(
                                  "10",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                              const Text(
                                " entries",
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                          // Search Bar
                          SizedBox(
                            width: 100,
                            height: 30,
                            child: TextField(
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Search:',
                                hintStyle: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                                filled: true,
                                fillColor: const Color(0xFF2D3748),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                ),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(6),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Tabel dengan Horizontal Scroll agar kolom Durasi Kerja muat
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          columnSpacing: 20,
                          headingRowHeight: 35,
                          horizontalMargin: 0,
                          columns: const [
                            DataColumn(
                              label: Text(
                                'NO',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'TANGGAL',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'CHECK-IN',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'CHECK-OUT',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'DURASI KERJA',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'STATUS',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                          rows: [
                            _buildDataRow(
                              '1',
                              '20-Nov-2025',
                              '09:36:08',
                              '19:19:55',
                              '9 JAM 43 MENIT',
                              const Color(0xFF4FD1C5),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),
                      // Pagination Info
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Showing 1 to 1 of 1 entries',
                            style: TextStyle(color: Colors.grey, fontSize: 9),
                          ),
                          Row(
                            children: [
                              _buildPageBtn(Icons.chevron_left),
                              _buildPageBtn(null, text: '1', isActive: true),
                              _buildPageBtn(Icons.chevron_right),
                            ],
                          ),
                        ],
                      ),
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

  // Widget Helper Baru untuk Data Row Tabel
  DataRow _buildDataRow(
    String no,
    String tgl,
    String checkIn,
    String checkOut,
    String durasi,
    Color statusColor,
  ) {
    return DataRow(
      cells: [
        DataCell(
          Text(no, style: const TextStyle(color: Colors.white, fontSize: 11)),
        ),
        DataCell(
          Text(tgl, style: const TextStyle(color: Colors.white, fontSize: 11)),
        ),
        DataCell(
          Text(
            checkIn,
            style: const TextStyle(color: Colors.white, fontSize: 10),
          ),
        ),
        DataCell(
          Text(
            checkOut,
            style: const TextStyle(color: Colors.white, fontSize: 10),
          ),
        ),
        DataCell(
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              durasi,
              style: const TextStyle(color: Colors.grey, fontSize: 9),
            ),
          ),
        ),
        DataCell(
          Container(
            width: 20,
            height: 12,
            decoration: BoxDecoration(
              color: statusColor,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDrawerItem(
    IconData icon,
    String title, {
    bool isActive = false,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isActive ? const Color(0xFF7B61FF) : Colors.grey,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isActive ? const Color(0xFF7B61FF) : Colors.grey,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      onTap: () {},
    );
  }

  Widget _buildFilterDropdown(String label, String hint) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 10),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: DropdownButton<String>(
              isExpanded: true,
              underline: const SizedBox(),
              hint: Text(hint, style: const TextStyle(fontSize: 10)),
              items: const [],
              onChanged: (val) {},
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPageBtn(IconData? icon, {String? text, bool isActive = false}) {
    return Container(
      margin: const EdgeInsets.only(left: 4),
      width: 25,
      height: 25,
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFF7B61FF) : const Color(0xFF2D3748),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: icon != null
            ? Icon(icon, color: Colors.white, size: 14)
            : Text(
                text!,
                style: const TextStyle(color: Colors.white, fontSize: 10),
              ),
      ),
    );
  }
}
