import 'package:flutter/material.dart';
import 'lcd_dalule_models.dart';

// إدارة حالة التطبيق (State Management)
class AppStateManager extends ChangeNotifier {
  List<PhoneModel> mainPhoneModels = [...mockPhoneModels];
  List<CommunitySuggestion> communitySuggestions = [
    CommunitySuggestion(
      id: 's1',
      brand: 'Infinix',
      model: 'Hot 30 Play',
      suggestedCompatibleCode: 'INF-H30-LCD',
      likesCount: 49,
      dislikesCount: 2,
    ),
    CommunitySuggestion(
      id: 's2',
      brand: 'Samsung',
      model: 'Galaxy A05',
      suggestedCompatibleCode: 'SAM-A05-LCD',
      likesCount: 12,
      dislikesCount: 0,
    ),
  ];

  void addSuggestion(String brand, String model, String code) {
    communitySuggestions.insert(0, CommunitySuggestion(
      id: DateTime.now().toString(),
      brand: brand,
      model: model,
      suggestedCompatibleCode: code,
    ));
    notifyListeners();
  }

  void vote(String id, bool isLike) {
    final index = communitySuggestions.indexWhere((s) => s.id == id);
    if (index != -1) {
      communitySuggestions[index].vote(isLike);
      
      // إذا تمت الموافقة، أضفه للقاعدة الرئيسية
      if (communitySuggestions[index].isApproved) {
        final existing = mainPhoneModels.any((m) => m.name == communitySuggestions[index].model);
        if (!existing) {
          mainPhoneModels.add(PhoneModel(
            id: 'app-${communitySuggestions[index].id}',
            brandId: 'other',
            name: communitySuggestions[index].model,
            lcdScreenCode: communitySuggestions[index].suggestedCompatibleCode,
          ));
        }
      }
      notifyListeners();
    }
  }
}

class CommunityPage extends StatefulWidget {
  @override
  _CommunityPageState createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  final AppStateManager stateManager = AppStateManager();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text('مقترحات مجتمع الفنيين', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue[600],
        elevation: 0,
        centerTitle: true,
      ),
      body: ListenableBuilder(
        listenable: stateManager,
        builder: (context, child) {
          return Column(
            children: [
              _buildSuggestButton(),
              Expanded(
                child: ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: stateManager.communitySuggestions.length,
                  itemBuilder: (context, index) {
                    return _buildSuggestionCard(stateManager.communitySuggestions[index]);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSuggestButton() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: InkWell(
        onTap: () => _showAddDialog(),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.blue[200]!, width: 2, style: BorderStyle.solid),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_circle_outline, color: Colors.blue[600]),
              SizedBox(width: 8),
              Text('إضافة اقتراح توافق جديد', 
                style: TextStyle(color: Colors.blue[600], fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuggestionCard(CommunitySuggestion suggestion) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (suggestion.isApproved)
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.green, borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    children: [
                      Icon(Icons.verified, color: Colors.white, size: 12),
                      SizedBox(width: 4),
                      Text('تم التضمين تلقائياً', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              Text('إقتراح مطابقة', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[400])),
            ],
          ),
          SizedBox(height: 8),
          Text('${suggestion.brand} ${suggestion.model}', 
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          SizedBox(height: 4),
          Row(
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(4)),
                child: Text(suggestion.suggestedCompatibleCode, 
                  style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Colors.blue[800], fontSize: 12)),
              ),
              Text(' :كود الشاشة المقترح ', style: TextStyle(fontSize: 12, color: Colors.grey[600])),
            ],
          ),
          SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _voteButton(
                  icon: Icons.thumb_up_alt_outlined,
                  label: '${suggestion.likesCount}',
                  subLabel: 'متطابقة',
                  color: Colors.green,
                  onTap: () => stateManager.vote(suggestion.id, true),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: _voteButton(
                  icon: Icons.thumb_down_alt_outlined,
                  label: '${suggestion.dislikesCount}',
                  subLabel: 'غير متطابقة',
                  color: Colors.red,
                  onTap: () => stateManager.vote(suggestion.id, false),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _voteButton({required IconData icon, required String label, required String subLabel, required Color color, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.1)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 18),
            SizedBox(width: 6),
            Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
            SizedBox(width: 4),
            Text(subLabel, style: TextStyle(fontSize: 10, color: color)),
          ],
        ),
      ),
    );
  }

  void _showAddDialog() {
    final brandController = TextEditingController();
    final modelController = TextEditingController();
    final codeController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        title: Text('إضافة اقتراح توافق', textAlign: TextAlign.center),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: brandController, textAlign: TextAlign.right, decoration: InputDecoration(hintText: 'الشركة (Brand)')),
            TextField(controller: modelController, textAlign: TextAlign.right, decoration: InputDecoration(hintText: 'الموديل (Model)')),
            TextField(controller: codeController, textAlign: TextAlign.center, decoration: InputDecoration(hintText: 'كود الشاشة المتوافقة')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('إلغاء')),
          ElevatedButton(
            onPressed: () {
              stateManager.addSuggestion(brandController.text, modelController.text, codeController.text);
              Navigator.pop(context);
            },
            child: Text('نشر للمجتمع'),
          ),
        ],
      ),
    );
  }
}
