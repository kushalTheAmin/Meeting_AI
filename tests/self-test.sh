#!/bin/bash

echo "🧪 Running Voice Notes AI Self-Tests..."
echo "======================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Function to check step
check_step() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
  else
    echo -e "${RED}❌ $1${NC}"
    FAILED=$((FAILED + 1))
  fi
}

# 1. Check if node_modules exists
echo ""
echo "📦 Step 1: Checking dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
  npm install
  check_step "Dependencies installation"
fi

# 2. Validate environment variables
echo ""
echo "🔑 Step 2: Validating environment variables..."
if [ -f ".env.local" ]; then
  node -e "
    require('dotenv').config({ path: '.env.local' });
    const required = ['GROQ_API_KEY', 'GEMINI_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    const missing = required.filter(v => !process.env[v]);
    if (missing.length) {
      console.error('Missing variables:', missing.join(', '));
      process.exit(1);
    }
  " 2>/dev/null
  check_step "Environment variables"
else
  echo -e "${RED}❌ .env.local file not found${NC}"
  echo -e "${YELLOW}⚠️  Copy .env.example to .env.local and add your API keys${NC}"
  FAILED=$((FAILED + 1))
fi

# 3. Test TypeScript compilation
echo ""
echo "📝 Step 3: Running TypeScript check..."
npm run type-check > /dev/null 2>&1
check_step "TypeScript compilation"

# 4. Test Groq API connection
echo ""
echo "🔌 Step 4: Testing Groq API connection..."
npm run test:groq > /dev/null 2>&1
check_step "Groq API connection"

# 5. Test Gemini API connection
echo ""
echo "🔌 Step 5: Testing Gemini API connection..."
npm run test:gemini > /dev/null 2>&1
check_step "Gemini API connection"

# 6. Test Supabase connection
echo ""
echo "🔌 Step 6: Testing Supabase connection..."
npm run test:supabase > /dev/null 2>&1
check_step "Supabase connection"

# 7. Run unit tests
echo ""
echo "🧪 Step 7: Running unit tests..."
npm run test:unit > /dev/null 2>&1
check_step "Unit tests"

# 8. Run integration tests
echo ""
echo "🔗 Step 8: Running integration tests..."
npm run test:integration > /dev/null 2>&1
check_step "Integration tests"

# 9. Test build
echo ""
echo "🏗️  Step 9: Testing production build..."
npm run build > /dev/null 2>&1
check_step "Production build"

# 10. Run linting
echo ""
echo "🔍 Step 10: Running linter..."
npm run lint > /dev/null 2>&1
check_step "ESLint"

# Final summary
echo ""
echo "======================================"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Ready to deploy.${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILED test(s) failed. Please fix the issues above.${NC}"
  exit 1
fi
