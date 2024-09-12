import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { styles } from "./style"; // Importing styles from your existing style file
import { ButtonPrimary } from "./components/Button";
import SectionMonitoringStatusItem from "./components/SectionMonitoringStatusItem";
import SectionMonitoringNotPresentItem from "./components/SectionMonitoringNotPresentItem";
import SectionMonitoringDoneItem from "./components/SectionMonitoringDoneItem";
import { apiGet } from "./wrapping";
import { PoppinsText } from './Poppins';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome icons

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

const UjianMonitoringDua: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSection2, setShowSection2] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showSection4, setShowSection4] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet<ApiResponse>({
          url: 'https://expapi.kelaspintar.dev/lms/v2/teacher/monitoring/8332',
          headers: {
            Authorization: 'Bearer your-token-here',  // Replace with actual token
          },
          retry: 3,
          fullResponse: false,
          sendLog: { type: ['REQUEST', 'ERROR'] },
          onTimeout: () => console.log('Request timed out.'),
        });

        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
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
            <PoppinsText>{data?.data.schedule_info.exam_name} {data?.data.schedule_info.mapel} {data?.data.schedule_info.school_name}</PoppinsText>
            <PoppinsText>{data?.data.schedule_info.rombel_class} ・ {data?.data.schedule_info.exam_type} ・ {data?.data.schedule_info.mapel}</PoppinsText>
            <View style={styles.hr} />
            <View style={styles.imageOne}>
              <Icon name="clock-o" size={15} color="#000" />
              <PoppinsText>Jumat, 12 Juni 2024, Jam 10:00 WITA</PoppinsText>
            </View>
            <View style={styles.status}>
              <PoppinsText>Sedang Berlangsung</PoppinsText>
            </View>
            <PoppinsText>1 jam : 20 menit tersisa</PoppinsText>
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <ButtonPrimary rounded bordered onPress={onPressDetailUjian}>
                  Detail Ujian
                </ButtonPrimary>
              </View>
              <View style={styles.buttonWrapper}>
                <ButtonPrimary rounded bordered onPress={() => console.log("Refresh button pressed")}>
                  Refresh
                </ButtonPrimary>
              </View>
            </View>
          </View>

          {/* Section 2: Students Present */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <PoppinsText>{data?.data.hadir.total_student_hadir} dari {data?.data.hadir.total_student} murid sudah hadir</PoppinsText>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.btnAction} onPress={() => setShowSection2(!showSection2)}>
                <Icon name={showSection2 ? "chevron-up" : "chevron-down"} size={15} color="#000" />
              </TouchableOpacity>
            </View>
            {showSection2 && (
              <View style={styles.sectionContent}>
                {data?.data.hadir.students.map((student) => (
                  <SectionMonitoringStatusItem
                    key={student.student_id}
                    photo={{ uri: student.avatar }}
                    name={student.student_name}
                    joinAt={student.start_date || 'Tanggal tidak tersedia'}
                    foul={student.total_violation?.toString() || '0'}
                    progressLabel={`${student.total_answered?.toString() || '0'} dari ${student.total_question?.toString() || '0'} soal`}
                    progressPercent={
                      student.total_answered && student.total_question
                        ? (student.total_answered / student.total_question) * 100
                        : 0
                    }
                  />
                ))}
              </View>
            )}
          </View>

          {/* Section 3: Students Not Present */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <PoppinsText>{data?.data.belum_hadir.total_students} murid belum hadir</PoppinsText>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.btnAction} onPress={() => setShowSection3(!showSection3)}>
                <Icon name={showSection3 ? "chevron-up" : "chevron-down"} size={15} color="#000" />
              </TouchableOpacity>
            </View>
            {showSection3 && (
              <View style={styles.sectionContent}>
                {data?.data.belum_hadir.students.map((student) => (
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

          {/* Section 4: Students Who Completed */}
          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <View style={styles.flex}>
                <PoppinsText>{data?.data.selesai_mengerjakan.total_students} murid selesai mengerjakan</PoppinsText>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.btnAction} onPress={() => setShowSection4(!showSection4)}>
                <Icon name={showSection4 ? "chevron-up" : "chevron-down"} size={15} color="#000" />
              </TouchableOpacity>
            </View>
            {showSection4 && (
              <View style={styles.sectionContent}>
                {data?.data.selesai_mengerjakan.students.map((student) => (
                  <SectionMonitoringDoneItem
                    key={student.student_id}
                    photo={{ uri: student.avatar }}
                    name={student.student_name}
                    timeCollect={student.end_time || 'Waktu tidak tersedia'}
                    duration={(() => {
                      const totalMinutes = parseInt(student.duration, 10);
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return hours > 0
                        ? `${hours} jam ${minutes > 0 ? `${minutes} menit` : ''}`
                        : `${minutes} menit`;
                    })()}
                    onPressPeriksa={() => onPressPeriksa(student)}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UjianMonitoringDua;
