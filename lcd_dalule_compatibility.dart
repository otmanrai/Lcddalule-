import 'package:flutter/material.dart';
import 'lcd_dalule_theme.dart';
import 'lcd_dalule_models.dart';
import 'lcd_dalule_brand_modal.dart';
import 'lcd_dalule_model_modal.dart';

class LcdCompatibilityScreen extends StatefulWidget {
  const LcdCompatibilityScreen({super.key});

  @override
  State<LcdCompatibilityScreen> createState() => _LcdCompatibilityScreenState();
}

class _LcdCompatibilityScreenState extends State<LcdCompatibilityScreen> {
  Brand? selectedBrand;
  PhoneModel? selectedModel;
  List<PhoneModel> compatibleModels = [];

  void _handleBrandSelect() {
    showBrandSelectionModal(context, mockBrands, (brand) {
      setState(() {
        selectedBrand = brand;
        selectedModel = null; // Reset model when brand changes
        compatibleModels = [];
      });
    });
  }

  void _handleModelSelect() {
    if (selectedBrand == null) return;
    
    final brandModels = mockPhoneModels.where((m) => m.brandId == selectedBrand!.id).toList();
    
    showModelSelectionModal(context, brandModels, (model) {
      setState(() {
        selectedModel = model;
        // Logic: Find all other models with same LCD code
        compatibleModels = mockPhoneModels
            .where((m) => m.lcdScreenCode == model.lcdScreenCode && m.id != model.id)
            .toList();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _buildHeader(context),
          _buildBody(context),
          _buildBottomNav(context),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.15,
      decoration: const BoxDecoration(
        color: AppTheme.primaryBlue,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      padding: const EdgeInsets.only(top: 40, left: 16, right: 16),
      child: Stack(
        children: [
          Align(
            alignment: Alignment.topLeft,
            child: IconButton(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
            ),
          ),
          const Align(
            alignment: Alignment.topCenter,
            child: Column(
              children: [
                Text(
                  'LCD Compatibility',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Find compatible LCD screens',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: MediaQuery.of(context).size.height * 0.11),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          CustomSoftCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Text(
                  'Select your phone',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2D3243),
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Find compatible LCD screens',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 24),
                _buildSelectorRow(
                  label: 'Brand',
                  value: selectedBrand?.name ?? 'Choose a brand',
                  icon: Icons.phone_android,
                  isActive: true,
                  onTap: _handleBrandSelect,
                ),
                const SizedBox(height: 16),
                _buildSelectorRow(
                  label: 'Model',
                  value: selectedModel?.name ?? 'Choose a model',
                  icon: Icons.smartphone,
                  isActive: selectedBrand != null,
                  onTap: _handleModelSelect,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: selectedModel == null ? _buildEmptyState() : _buildResultsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSelectorRow({
    required String label,
    required String value,
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: isActive ? onTap : null,
          borderRadius: BorderRadius.circular(15),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isActive ? Colors.grey[50] : Colors.grey[100],
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: isActive ? Colors.grey[200]! : Colors.grey[300]!),
            ),
            child: Row(
              children: [
                Icon(icon, color: isActive ? AppTheme.primaryBlue : Colors.grey, size: 20),
                const SizedBox(width: 12),
                Text(
                  value,
                  style: TextStyle(
                    color: isActive ? Colors.black87 : Colors.grey[400],
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
                const Spacer(),
                Icon(Icons.expand_more, color: Colors.grey[400]),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.primaryBlue.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.phone_iphone, color: AppTheme.primaryBlue, size: 48),
        ),
        const SizedBox(height: 16),
        const Text(
          'Select a phone model',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2D3243)),
        ),
        const SizedBox(height: 8),
        const Text(
          'Choose your brand and model to see\ncompatible LCD screens',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.grey, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildResultsList() {
    if (compatibleModels.isEmpty) {
      return const Center(
        child: Text(
          'No compatible models found for this LCD code.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'COMPATIBLE PHONES',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[600],
                  letterSpacing: 1.2,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(
                  selectedModel!.lcdScreenCode,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryBlue,
                  ),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.only(bottom: 100),
            itemCount: compatibleModels.length,
            itemBuilder: (context, index) {
              final model = compatibleModels[index];
              final brand = mockBrands.firstWhere((b) => b.id == model.brandId);
              return CustomSoftCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.phone_iphone, color: AppTheme.primaryBlue, size: 20),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            model.name,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Text(
                            brand.name,
                            style: TextStyle(color: Colors.grey[600], fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.check_circle, color: Colors.green, size: 20),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Positioned(
      bottom: 30,
      left: 24,
      right: 24,
      child: Container(
        height: 70,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(35),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            IconButton(onPressed: () {}, icon: const Icon(Icons.info_outline, color: Colors.grey)),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                children: [
                  Icon(Icons.search, color: AppTheme.primaryBlue),
                  SizedBox(width: 4),
                  Text(
                    'Lcd Q',
                    style: TextStyle(
                      color: AppTheme.primaryBlue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.home_outlined, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

