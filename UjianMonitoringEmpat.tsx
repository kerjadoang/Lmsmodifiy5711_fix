import React, { Fragment, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { appColors } from './helpers/colors';
import { wp } from './helpers/screenSizes';
import { fonts } from './helpers/fonts';
import { ButtonPrimary } from './components/Button';
import { StackNavigationProp } from './types/navigation.types';
import SectionMonitoringStatusItem from './components/SectionMonitoringStatusItem';
import SectionMonitoringNotPresentItemItem from './components/SectionMonitoringNotPresentItem';
import SectionMonitoringDoneItem from './components/SectionMonitoringDoneItem';

import { apiGet } from './wrapping';
import SvgUri from 'react-native-svg-uri';
import { styles } from './style';
import SectionMonitoringNotPresentItem from './components/SectionMonitoringNotPresentItem';

interface ApiResponse {
  code: number;
  message: string;
  total_data: number;
  data: {
    schedule_info: {
      exam_name: string;
      exam_type: string;
      school_name: string;
      rombel_class: string;
      mapel: string;
      start_date: string;
      end_date: string;
      time_zone: string;
      status_exam: string;
    };
    hadir: {
      total_student: number;
      total_student_hadir: number;
      students: Array<{
        student_name: string;
        student_id: number;
        avatar: string;
        start_date?: string;
        total_violation?: number;
        total_question?: number;
        total_answered?: number;
      }>;
    };
    belum_hadir: {
      total_students: number;
      students: Array<{
        student_name: string;
        student_id: number;
        avatar: string;
        no_phone: string;
        email: string;
      }>;
    };
    selesai_mengerjakan: {
      total_students: number;
      students: Array<{
        student_name: string;
        student_id: number;
        avatar: string;
        end_time: string;
        duration: string;
      }>;
    };
  };
  time: string;
  log_id: string;
}

const UjianMonitoringEmpat: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSection2, setShowSection2] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showSection4, setShowSection4] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet({
          url: 'https://expapi.kelaspintar.dev/lms/v2/teacher/monitoring/8332',
          headers: {
            Authorization:
              'Bearer compressed_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzU2NDMzLCJ1dWlkIjoiZmZjYzQwMmMtMzYxMS00Y2U4LWFkNDEtZWNlYjZkNDFmMmE5IiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJZRlIgQXN0ZXJpYSBEd2kgV2FzYW5hd3F0aSIsImF2YXRhciI6Imh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9rcF9yZWJvcm5fYnVja2V0L2tlbGFzX3BpbnRhci8iLCJlbWFpbCI6Imd1cnUxM0BzbWFmb25zdml0YWUxLmtwLmlkIn19LCJhdWQiOiJrcC1qaXRzaS1kZXYiLCJpc3MiOiJrcC1qaXRzaS1kZXYiLCJzdWIiOiJtZWV0LmtlbGFzcGludGFyLmRldiIsInJvb20iOiIqIiwiZXhwIjoxNzgxOTg0OTQwfQ.tmrVTsDqwRwZu7FXccbq1-jaYR6g1eVZSPE3U0ZccXc',
          },
          retry: 3, // Retry API call 3 times in case of failure
          fullResponse: false, // We only need the data part
          sendLog: {
            type: ['REQUEST', 'ERROR'], // Log requests and errors
          },
          onTimeout: () => {
            console.log('Request timed out.');
          },
        });

        setData(response); // Save the API data in state
        setLoading(false); // Set loading to false when the data is fetched
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Assign the error message
        } else {
          setError('An unknown error occurred'); // Fallback for other error types
        }
        setLoading(false); // Stop loading when the API call fails
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const onPressDetailUjian = () => {
    // Logic for detail button
  };

  const onPressPeriksa = (res: any) => {
    // Logic for "periksa" button
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.paddingContainer}>
          {/* Section 1 */}
          <View style={styles.sectionContainer}>
            <Text >
              {data?.data.schedule_info.exam_name}{' '}
              {data?.data.schedule_info.mapel}{' '}
              {data?.data.schedule_info.school_name}
            </Text>
            <Text>
              {data?.data.schedule_info.rombel_class} ・{' '}
              {data?.data.schedule_info.exam_type} ・{' '}
              {data?.data.schedule_info.mapel}
            </Text>
            <View style={styles.hr} />
            <View style={styles.imageOne}>
              <Image
                source={require('./assets/icons/clock.png')} // Ensure the path and extension are correct
                style={{ width: 15, height: 15 }} // Adjust image size
              />
              <Text> Jumat, 12 Juni 2024, Jam 10:00 WITA</Text>
            </View>
            <View style={styles.status}>
              <Text style={styles.statusLabel}>Sedang Berlangsung</Text>
            </View>
            <Text> 1 jam : 20 menit tersisa </Text>
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <ButtonPrimary rounded bordered onPress={onPressDetailUjian}>
                  Detail Ujian
                </ButtonPrimary>
              </View>
              <View style={styles.buttonWrapper}>
                <ButtonPrimary
                  rounded
                  bordered
                  onPress={() => console.log('Refresh button pressed')}>
                  Refresh
                </ButtonPrimary>
              </View>
            </View>
          </View>

          {/* Section 2 */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <Text>
                  {data?.data.hadir.total_student_hadir} dari
                  {data?.data.hadir.total_student} murid sudah hadir
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnAction}
                onPress={() => setShowSection2(!showSection2)}>
                <Image
                  source={require('./assets/icons/arrow-down.png')}
                  style={[
                    styles.arrowImage,
                    {
                      transform: [
                        { rotateX: showSection2 ? '180deg' : '0deg' },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {showSection2 && (
              <View style={styles.sectionContent}>
                {data?.data.hadir.students.map((student, index) => (
                  <SectionMonitoringStatusItem
                    key={student.student_id}
                    photo={{ uri: student.avatar }}
                    name={student.student_name}
                    joinAt={
                      student.start_date
                        ? student.start_date.toString()
                        : 'Tanggal tidak tersedia'
                    }
                    foul={student.total_violation?.toString() || '0'}
                    progressLabel={`${
                      student.total_answered?.toString() || '0'
                    } dari ${student.total_question?.toString() || '0'} soal`}
                    progressPercent={
                      student.total_answered && student.total_question
                        ? (student.total_answered / student.total_question) *
                          100
                        : 0
                    }
                  />
                ))}
              </View>
            )}
          </View>

          {/* Section 3 */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <Text>
                  {data?.data.belum_hadir.total_students} murid belum hadir{' '}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnAction}
                onPress={() => setShowSection3(!showSection3)}>
                <Image
                  source={require('./assets/icons/arrow-down.png')}
                  style={[
                    styles.arrowImage,
                    {
                      transform: [
                        { rotateX: showSection3 ? '180deg' : '0deg' },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {showSection3 && (
              <View style={styles.sectionContent}>
                {data?.data.belum_hadir.students.map((student, index) => (
                  <SectionMonitoringNotPresentItem
                    key={student.student_id}
                    photo={{ uri: student.avatar }}
                    name={student.student_name}
                    phone={student.no_phone}
                    email={student.email}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Section 4 */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <Text>
                  {' '}
                  {data?.data.selesai_mengerjakan.total_students} murid selesai
                  mengerjakan{' '}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnAction}
                onPress={() => setShowSection4(!showSection4)}>
                <Image
                  source={require('./assets/icons/arrow-down.png')}
                  style={[
                    styles.arrowImage,
                    {
                      transform: [
                        { rotateX: showSection4 ? '180deg' : '0deg' },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {showSection4 && (
              <View style={styles.sectionContent}>
                {data?.data.selesai_mengerjakan.students.map(
                  (student, index) => (
                    <SectionMonitoringDoneItem
                      key={student.student_id}
                      photo={{ uri: student.avatar }}
                      name={student.student_name}
                      timeCollect={
                        student.end_time
                          ? student.end_time.toString()
                          : 'Waktu tidak tersedia'
                      }
                      duration={(() => {
                        const totalMinutes = parseInt(student.duration, 10);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return hours > 0
                          ? `${hours} jam ${
                              minutes > 0 ? `${minutes} menit` : ''
                            }`
                          : `${minutes} menit`;
                      })()}
                      onPressPeriksa={() => onPressPeriksa(student)}
                    />
                  )
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UjianMonitoringEmpat;
