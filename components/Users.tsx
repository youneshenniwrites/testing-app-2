import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { useDeboucedValue } from "@/hooks/useDebouncedValue";

function Users() {
  const { loading, error, users } = useFetchUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDeboucedValue(searchTerm, 300);

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.first.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      user.name.last.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  if (loading) return <Text style={styles.message}>Loading...</Text>;
  if (error) return <Text style={styles.message}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
        accessibilityLabel="Search users"
      />
      <ScrollView>
        {debouncedValue !== "" && filteredUsers.length === 0 ? (
          <Text style={styles.message}>
            No users found matching "{debouncedValue}".
          </Text>
        ) : (
          filteredUsers.map((user: any) => (
            <View key={user.login.uuid} style={styles.userCard}>
              <Text style={styles.userName}>
                {user.name.first} {user.name.last}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  userCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
});

export default Users;
