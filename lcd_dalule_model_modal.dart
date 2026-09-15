import 'package:flutter/material.dart';
import 'lcd_dalule_models.dart';
import 'lcd_dalule_theme.dart';

class ModelSelectionModal extends StatefulWidget {
  final List<PhoneModel> models;
  final Function(PhoneModel) onModelSelected;

  const ModelSelectionModal({
    super.key,
    required this.models,
    required this.onModelSelected,
  });

  @override
  State<ModelSelectionModal> createState() => _ModelSelectionModalState();
}

class _ModelSelectionModalState extends State<ModelSelectionModal> {
  String _searchQuery = '';
  late List<PhoneModel> _filteredModels;

  @override
  void initState() {
    super.initState();
    _filteredModels = widget.models;
  }

  void _filterModels(String query) {
    setState(() {
      _searchQuery = query;
      _filteredModels = widget.models
          .where((model) => model.name.toLowerCase().contains(query.toLowerCase()))
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
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'Select model',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.grey[100]!),
              ),
              child: TextField(
                onChanged: _filterModels,
                decoration: const InputDecoration(
                  hintText: '...Search model',
                  hintStyle: TextStyle(color: Colors.grey),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  suffixIcon: Icon(Icons.search, color: AppTheme.primaryBlue),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
              itemCount: _filteredModels.length,
              separatorBuilder: (context, index) => Divider(
                color: Colors.grey[100],
                height: 1,
              ),
              itemBuilder: (context, index) {
                final model = _filteredModels[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  onTap: () {
                    widget.onModelSelected(model);
                    Navigator.pop(context);
                  },
                  title: Text(
                    model.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF2D3243),
                    ),
                  ),
                  subtitle: Text(
                    'LCD: ${model.lcdScreenCode}',
                    style: TextStyle(color: Colors.grey[500], fontSize: 12),
                  ),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

void showModelSelectionModal(BuildContext context, List<PhoneModel> models, Function(PhoneModel) onModelSelected) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => ModelSelectionModal(
      models: models,
      onModelSelected: onModelSelected,
    ),
  );
}
