# Flutter Mobile App Builder

Build a stunning cross-platform mobile application with Flutter and Dart.

---

## 🎯 Your Mission

Create a **10x quality Flutter mobile app** for iOS and Android. The app must feel native, be performant, and delight users.

---

## 📋 User Requirements

**Read the user's requirements carefully:**

```
{{USER_REQUIREMENTS}}
```

Parse these requirements to identify:
1. **App Purpose**: What does this app do?
2. **Target Users**: Who will use this app?
3. **Core Features**: What functionality is essential?
4. **Screens Needed**: What screens are required?
5. **Data**: What data needs to be stored/fetched?
6. **Platform Features**: Camera, location, notifications?

---

## 🛠 Tech Stack

```
Framework:        Flutter 3.24+
Language:         Dart 3.x
State Management: Riverpod
Navigation:       GoRouter
Networking:       Dio
Local Storage:    Hive
DI:               GetIt + Injectable
Serialization:    Freezed + JsonSerializable
UI:               Material Design 3
Animations:       Flutter Animate
```

---

## 📁 Project Structure

```
my_app/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart              # MaterialApp setup
│   │   ├── router.dart           # GoRouter config
│   │   └── injection.dart        # GetIt setup
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_colors.dart
│   │   │   ├── app_sizes.dart
│   │   │   └── app_strings.dart
│   │   ├── theme/
│   │   │   ├── app_theme.dart
│   │   │   └── text_styles.dart
│   │   ├── utils/
│   │   │   ├── extensions.dart
│   │   │   └── helpers.dart
│   │   └── errors/
│   │       └── failures.dart
│   ├── data/
│   │   ├── models/               # Data models
│   │   ├── repositories/         # Repository implementations
│   │   └── datasources/
│   │       ├── remote/           # API data sources
│   │       └── local/            # Local storage
│   ├── domain/
│   │   ├── entities/             # Business entities
│   │   ├── repositories/         # Repository interfaces
│   │   └── usecases/             # Business logic
│   └── presentation/
│       ├── screens/              # Screen widgets
│       ├── widgets/              # Reusable widgets
│       ├── providers/            # Riverpod providers
│       └── controllers/          # Screen controllers
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── test/
├── pubspec.yaml
└── README.md
```

---

## 🚀 Build Process

### Phase 1: Project Setup

```bash
# Create Flutter project
flutter create my_app --org com.yourcompany
cd my_app

# Add dependencies to pubspec.yaml
```

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.3.0

  # Navigation
  go_router: ^13.0.0

  # Networking
  dio: ^5.4.0
  retrofit: ^4.1.0

  # Local Storage
  hive_flutter: ^1.1.0

  # DI
  get_it: ^7.6.0
  injectable: ^2.3.0

  # Serialization
  freezed_annotation: ^2.4.0
  json_annotation: ^4.8.0

  # UI
  flutter_animate: ^4.3.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  flutter_svg: ^2.0.0

  # Utilities
  intl: ^0.18.0
  flutter_secure_storage: ^9.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter

  # Code generation
  build_runner: ^2.4.0
  freezed: ^2.4.0
  json_serializable: ^6.7.0
  riverpod_generator: ^2.3.0
  injectable_generator: ^2.4.0
  retrofit_generator: ^8.0.0

  # Linting
  flutter_lints: ^3.0.0
```

### Phase 2: App Configuration

```dart
// lib/app/app.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';
import '../core/theme/app_theme.dart';

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'My App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: router,
    );
  }
}
```

```dart
// lib/app/router.dart
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/details/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return DetailsScreen(id: id);
        },
      ),
      // Add more routes based on requirements
    ],
  );
});
```

### Phase 3: Theme Configuration

```dart
// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static const _primaryColor = Color(0xFF6366F1);
  static const _secondaryColor = Color(0xFF8B5CF6);

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _primaryColor,
        secondary: _secondaryColor,
      ),
      fontFamily: 'Inter',
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 1,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 16,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _primaryColor,
        secondary: _secondaryColor,
        brightness: Brightness.dark,
      ),
      fontFamily: 'Inter',
      // ... same customizations as light
    );
  }
}
```

### Phase 4: Reusable Widgets

```dart
// lib/presentation/widgets/app_button.dart
import 'package:flutter/material.dart';

enum AppButtonVariant { primary, secondary, outline, ghost }
enum AppButtonSize { small, medium, large }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool loading;
  final IconData? icon;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.loading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final padding = switch (size) {
      AppButtonSize.small => const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      AppButtonSize.medium => const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      AppButtonSize.large => const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
    };

    final textStyle = switch (size) {
      AppButtonSize.small => theme.textTheme.labelMedium,
      AppButtonSize.medium => theme.textTheme.labelLarge,
      AppButtonSize.large => theme.textTheme.titleMedium,
    };

    Widget child = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (loading)
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: variant == AppButtonVariant.primary
                    ? colorScheme.onPrimary
                    : colorScheme.primary,
              ),
            ),
          ),
        if (icon != null && !loading)
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Icon(icon, size: 18),
          ),
        Text(text, style: textStyle?.copyWith(fontWeight: FontWeight.w600)),
      ],
    );

    return switch (variant) {
      AppButtonVariant.primary => ElevatedButton(
          onPressed: loading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            padding: padding,
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
          ),
          child: child,
        ),
      AppButtonVariant.secondary => ElevatedButton(
          onPressed: loading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            padding: padding,
            backgroundColor: colorScheme.secondaryContainer,
            foregroundColor: colorScheme.onSecondaryContainer,
          ),
          child: child,
        ),
      AppButtonVariant.outline => OutlinedButton(
          onPressed: loading ? null : onPressed,
          style: OutlinedButton.styleFrom(padding: padding),
          child: child,
        ),
      AppButtonVariant.ghost => TextButton(
          onPressed: loading ? null : onPressed,
          style: TextButton.styleFrom(padding: padding),
          child: child,
        ),
    };
  }
}
```

```dart
// lib/presentation/widgets/app_text_field.dart
import 'package:flutter/material.dart';

class AppTextField extends StatelessWidget {
  final String? label;
  final String? hint;
  final String? error;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;
  final int maxLines;

  const AppTextField({
    super.key,
    this.label,
    this.hint,
    this.error,
    this.controller,
    this.keyboardType,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onChanged,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscureText,
          maxLines: maxLines,
          onChanged: onChanged,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefixIcon,
            suffixIcon: suffixIcon,
            errorText: error,
            fillColor: error != null
                ? theme.colorScheme.errorContainer.withOpacity(0.3)
                : null,
          ),
        ),
      ],
    );
  }
}
```

```dart
// lib/presentation/widgets/app_card.dart
import 'package:flutter/material.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final VoidCallback? onTap;
  final Color? color;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: color ?? theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: theme.colorScheme.outlineVariant.withOpacity(0.5),
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}
```

### Phase 5: Screen Templates

```dart
// lib/presentation/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Refresh data
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Welcome Section
            _buildWelcomeSection(context),
            const SizedBox(height: 24),

            // Quick Actions
            _buildQuickActions(context),
            const SizedBox(height: 24),

            // Content List
            _buildContentList(context),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (index) {},
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeSection(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Welcome back!',
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ).animate().fadeIn(duration: 300.ms).slideX(begin: -0.1),
        const SizedBox(height: 4),
        Text(
          'What would you like to do today?',
          style: theme.textTheme.bodyLarge?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ).animate().fadeIn(duration: 300.ms, delay: 100.ms),
      ],
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _QuickActionCard(
            icon: Icons.add,
            label: 'Create',
            color: Colors.blue,
            onTap: () {},
          ).animate().fadeIn(duration: 300.ms, delay: 200.ms).slideY(begin: 0.1),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionCard(
            icon: Icons.search,
            label: 'Search',
            color: Colors.purple,
            onTap: () {},
          ).animate().fadeIn(duration: 300.ms, delay: 300.ms).slideY(begin: 0.1),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionCard(
            icon: Icons.settings,
            label: 'Settings',
            color: Colors.orange,
            onTap: () {},
          ).animate().fadeIn(duration: 300.ms, delay: 400.ms).slideY(begin: 0.1),
        ),
      ],
    );
  }

  Widget _buildContentList(BuildContext context) {
    // Build list based on data
    return const Column(
      children: [
        // Add content items
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: color.withOpacity(0.1),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 8),
              Text(
                label,
                style: theme.textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## 🎨 Design Guidelines

### Material Design 3
- Use Material 3 widgets
- Follow color scheme guidelines
- Proper elevation and shadows
- Consistent corner radii (16px default)

### Typography
- Use font weights purposefully
- Clear text hierarchy
- Proper line heights
- Readable sizes

### Animations
- Subtle and purposeful
- 200-400ms duration
- Ease curves
- Hero animations for transitions

### Accessibility
- Semantic widgets
- Proper contrast
- Touch targets (48x48 min)
- Screen reader support

---

## ✅ Quality Checklist

- [ ] App runs on iOS and Android
- [ ] No console errors or warnings
- [ ] Smooth 60fps animations
- [ ] Proper loading states
- [ ] Error handling implemented
- [ ] Dark mode works correctly
- [ ] Responsive layouts
- [ ] State persists correctly
- [ ] Navigation works smoothly

---

Now build the Flutter app based on the user's requirements!
