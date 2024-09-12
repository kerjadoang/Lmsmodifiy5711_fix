import {
  GET_UJIAN_TENGAH_SEMESTER_PACKAGE_DESTROY,
  GET_UJIAN_TENGAH_SEMESTER_PACKAGE_FAILED,
  GET_UJIAN_TENGAH_SEMESTER_PACKAGE_REQUEST,
  GET_UJIAN_TENGAH_SEMESTER_PACKAGE_SUCCESS,
} from './type';

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const getUjianTengahSemesterPackage = (state = initialState, action: any) => {
  switch (action?.type) {
    case GET_UJIAN_TENGAH_SEMESTER_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_UJIAN_TENGAH_SEMESTER_PACKAGE_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: '',
      };
    case GET_UJIAN_TENGAH_SEMESTER_PACKAGE_FAILED:
      return {
        loading: false,
        data: [],
        error: action.payload,
      };
    case GET_UJIAN_TENGAH_SEMESTER_PACKAGE_DESTROY:
      return state;
    default:
      return state;
  }
};

export default getUjianTengahSemesterPackage;
