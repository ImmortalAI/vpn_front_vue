import apiClient from '@/utils/apiClient';
import { UserAllGetRsSchema, UserGetRsSchema, UserPatchRsSchema, type UserPatchRq } from './schema';

export async function userGet() {
  try {
    const res = await apiClient.get('/user');
    return UserGetRsSchema.parse(res.data);
  } catch (error) {
    throw error;
  }
}

export async function userPatch(userId: string, request: UserPatchRq) {
  try {
    const res = await apiClient.patch(`/user/${userId}`, request);
    return UserPatchRsSchema.parse(res.data);
  } catch (error) {
    throw error;
  }
}

export async function userAll() {
  try {
    const res = await apiClient.get('/user/all');
    return UserAllGetRsSchema.parse(res.data);
  } catch (error) {
    throw error;
  }
}
