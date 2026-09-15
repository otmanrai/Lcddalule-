import 'package:flutter/material.dart';
import 'lcd_dalule_models.dart';
import 'lcd_dalule_theme.dart';

class BrandSelectionModal extends StatefulWidget {
  final List<Brand> brands;
  final Function(Brand) onBrandSelected;

  const BrandSelectionModal({
    super.key,
    required this.brands,
    required this.onBrandSelected,
  });

  @override
  State<BrandSelectionModal> createState() => _BrandSelectionModalState();
}

class _BrandSelectionModalState extends State<BrandSelectionModal> {
  String _searchQuery = '';
  late List<Brand> _filteredBrands;

  @override
  void initState() {
    super.initState();
    _filteredBrands = widget.brands;
  }

  void _filterBrands(String query) {
    setState(() {
      _searchQuery = query;
      _filteredBrands = widget.brands
          .where((brand) => brand.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Title Aligned Right
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'Select brand',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
              ],
            ),
          ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.grey[100]!),
              ),
              child: TextField(
                onChanged: _filterBrands,
                decoration: const InputDecoration(
                  hintText: '...Search',
                  hintStyle: TextStyle(color: Colors.grey),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  suffixIcon: Icon(Icons.search, color: AppTheme.primaryBlue),
                ),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Brands List
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
              itemCount: _filteredBrands.length,
              separatorBuilder: (context, index) => Divider(
                color: Colors.grey[100],
                height: 1,
              ),
              itemBuilder: (context, index) {
                final brand = _filteredBrands[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  onTap: () {
                    widget.onBrandSelected(brand);
                    Navigator.pop(context);
                  },
                  title: Text(
                    brand.name.toUpperCase(),
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                      color: Color(0xFF2D3243),
                    ),
                  ),
                  trailing: brand.logoUrl.isNotEmpty
                      ? Image.network(
                          brand.logoUrl,
                          width: 24,
                          height: 24,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.business, color: Colors.grey),
                        )
                      : const Icon(Icons.business, color: Colors.grey),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Helper function to show the modal
void showBrandSelectionModal(BuildContext context, List<Brand> brands, Function(Brand) onBrandSelected) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => BrandSelectionModal(
      brands: brands,
      onBrandSelected: onBrandSelected,
    ),
  );
}
