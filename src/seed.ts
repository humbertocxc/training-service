import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const defaultExercises: Array<{
    name: string;
    category: 'PUSH' | 'PULL' | 'CORE' | 'LEGS' | 'SKILL';
    description: string;
    mediaUrl: undefined;
    imageId: undefined;
  }> = [
    {
      name: 'Push Up',
      category: 'PUSH',
      description: 'A basic push exercise.',
      mediaUrl: undefined,
      imageId: undefined,
    },
    {
      name: 'Pull Up',
      category: 'PULL',
      description: 'A basic pull exercise.',
      mediaUrl: undefined,
      imageId: undefined,
    },
    {
      name: 'Plank',
      category: 'CORE',
      description: 'Core stability exercise.',
      mediaUrl: undefined,
      imageId: undefined,
    },
    {
      name: 'Squat',
      category: 'LEGS',
      description: 'Leg strength exercise.',
      mediaUrl: undefined,
      imageId: undefined,
    },
    {
      name: 'Handstand',
      category: 'SKILL',
      description: 'Skill-based exercise.',
      mediaUrl: undefined,
      imageId: undefined,
    },
  ];

  for (const ex of defaultExercises) {
    const result = await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
    console.log(`  ✓ Seeded exercise: ${result.name} (id: ${result.id})`);
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
