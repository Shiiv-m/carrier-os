import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  contact: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
    marginTop: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
  },
  entrySubtitle: {
    fontFamily: 'Helvetica-Oblique',
  },
  date: {
    fontSize: 10,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 15,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default function ResumePDF({ resume, isPreview = false }: { resume: Resume | null, isPreview?: boolean }) {
  if (!resume) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No resume data available.</Text>
        </Page>
      </Document>
    );
  }

  const { personalInfo, experience, education, skills } = resume;

  const dummyExperience = [
    {
      id: "dummy-exp",
      company: "Acme Innovate (Example)",
      position: "Software Engineer",
      startDate: "Jan 2020",
      endDate: "Present",
      current: true,
      description: "• Engineered highly scalable web applications.\\n• Reduced load times by 40% through code splitting.\\n• Mentored junior developers in React best practices."
    }
  ];

  const dummyEducation = [
    {
      id: "dummy-edu",
      institution: "State University (Example)",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2016",
      endDate: "2020"
    }
  ];

  const dummySkills = [
    { id: "s1", name: "React.js" },
    { id: "s2", name: "TypeScript" },
    { id: "s3", name: "Node.js" },
    { id: "s4", name: "Tailwind CSS" }
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, (!personalInfo?.fullName) && isPreview ? { opacity: 0.4 } : {}]}>
          <Text style={styles.name}>{personalInfo?.fullName || (isPreview ? 'John Doe' : '')}</Text>
          <Text style={styles.contact}>
            {[
              personalInfo?.email || (isPreview ? 'john.doe@example.com' : ''),
              personalInfo?.phone || (isPreview ? '(555) 123-4567' : ''),
              personalInfo?.location || (isPreview ? 'New York, NY' : ''),
              personalInfo?.linkedin,
              personalInfo?.website
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>

        {/* Skills */}
        {skills && skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              <Text>{skills.map(s => s.name).join(', ')}</Text>
            </View>
          </View>
        ) : (isPreview && (
          <View style={[styles.section, { opacity: 0.4 }]}>
            <Text style={styles.sectionTitle}>Skills (Template)</Text>
            <View style={styles.skills}>
              <Text>{dummySkills.map(s => s.name).join(', ')}</Text>
            </View>
          </View>
        ))}

        {/* Experience */}
        {experience && experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map(exp => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.position}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                {exp.description && exp.description.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
                  const text = isBullet ? trimmed.substring(1).trim() : trimmed;
                  return (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{text}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ) : (isPreview && (
          <View style={[styles.section, { opacity: 0.4 }]}>
            <Text style={styles.sectionTitle}>Experience (Template)</Text>
            {dummyExperience.map(exp => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.position}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                {exp.description.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
                  const text = isBullet ? trimmed.substring(1).trim() : trimmed;
                  return (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{text}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ))}

        {/* Education */}
        {education && education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
              </View>
            ))}
          </View>
        ) : (isPreview && (
          <View style={[styles.section, { opacity: 0.4 }]}>
            <Text style={styles.sectionTitle}>Education (Template)</Text>
            {dummyEducation.map(edu => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
